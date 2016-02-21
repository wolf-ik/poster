from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response

from post.models import Post, Comment, Like, Rating, Tag, Category
from post.serializers import PostSerializer, CommentSerializer, LikeSerializer, RatingSerializer, TagSerializer, \
    PostShowSerializer, CommentShowSerializer, CategorySerializer
from post.permissions import IsObjectOwnerOrAdmin


class CategoryViewSet(mixins.ListModelMixin,
                      viewsets.GenericViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TagViewSet(mixins.ListModelMixin,
                 viewsets.GenericViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (permissions.AllowAny,)

    def list(self, request, *args, **kwargs):
        sort_by = request.query_params.get('sort_by', None)
        sort_mapping = {
            'all': Tag.objects.all(),
            'random': Tag.objects.all().order_by('?')[:20],
        }
        self.queryset = sort_mapping.get(sort_by, self.queryset)
        return super(TagViewSet, self).list(request, *args, **kwargs)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsObjectOwnerOrAdmin)

    @staticmethod
    def replace_data_to_public(resp):
        resp.data = PostShowSerializer(Post.objects.get(id=resp.data['id'])).data
        return resp

    @staticmethod
    def get_list_tags(tags):
        def foo(tag):
            obj, created = Tag.objects.get_or_create(text=tag.get('text', None))
            return obj

        assert(isinstance(tags, list))
        l = map(foo, tags)
        return l

    def list(self, request, *args, **kwargs):
        self.serializer_class = PostShowSerializer
        sort_by = request.query_params.get('sort_by', None)
        username = request.query_params.get('username', None)
        sort_mapping = {
            'all': Post.objects.order_by('-created_at'),
            'top': Post.objects.order_by('-rating')[:10],
            'user': Post.objects.filter(owner__username=username).order_by('-created_at'),
        }
        self.queryset = sort_mapping.get(sort_by, self.queryset)

        return super(PostViewSet, self).list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = PostShowSerializer
        return super(PostViewSet, self).retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        tags = self.get_list_tags(self.request.data.get('tags', ''))
        category = self.request.data.get('category', None)
        category_obj = Category.objects.get(id=category['id'])
        post = serializer.save(owner=self.request.user, category=category_obj)
        for tag in tags:
            post.tags.add(tag)

    def perform_update(self, serializer):
        tags = self.get_list_tags(self.request.data.get('tags', ''))
        category = self.request.data.get('category', None)
        category_obj = Category.objects.get(id=category['id'])
        post = serializer.save(category=category_obj)
        post.tags.clear()
        for tag in tags:
            post.tags.add(tag)

    def create(self, request, *args, **kwargs):
        resp = super(PostViewSet, self).create(request, *args, **kwargs)
        return self.replace_data_to_public(resp)

    def update(self, request, *args, **kwargs):
        resp = super(PostViewSet, self).update(request, *args, **kwargs)
        return self.replace_data_to_public(resp)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.order_by('-create_at')
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsObjectOwnerOrAdmin)

    @staticmethod
    def replace_data_to_public(resp):
        resp.data = CommentShowSerializer(Comment.objects.get(id=resp.data['id'])).data
        return resp

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CommentShowSerializer
        return super(CommentViewSet, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.serializer_class = CommentShowSerializer
        post_id = request.query_params.get('post_id', None)
        self.queryset = Comment.objects.filter(post_id=post_id)
        return super(CommentViewSet, self).list(request, *args, **kwargs)

    def perform_create(self, serializer):
        post = Post.objects.get(id=self.request.data.get('post_id', None))
        serializer.save(owner=self.request.user, post=post)

    def update(self, request, *args, **kwargs):
        resp = super(CommentViewSet, self).update(request, *args, **kwargs)
        return self.replace_data_to_public(resp)

    def create(self, request, *args, **kwargs):
        resp = super(CommentViewSet, self).create(request, *args, **kwargs)
        return self.replace_data_to_public(resp)


class LikeViewSet(mixins.CreateModelMixin,
                  mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = (permissions.IsAuthenticated, IsObjectOwnerOrAdmin)

    def create(self, request, *args, **kwargs):
        user = request.user
        comment_id = request.data.get('comment_id', None)
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response({'detail': 'Comment does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            comment.likes.get(owner=user)
        except Like.DoesNotExist:
            like = comment.likes.create(owner=user, target=comment.owner)
            serialized = LikeSerializer(like)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        return Response({'detail': 'Already liked.'}, status=status.HTTP_400_BAD_REQUEST)


class RatingViewSet(mixins.CreateModelMixin,
                    viewsets.GenericViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @staticmethod
    def recalc_post_rating(post, value):
        rating = post.rating
        count = post.ratings_count
        new_rating = (rating * count + value) / (count + 1)
        post.rating = new_rating
        post.ratings_count = count + 1
        post.save()

    def create(self, request, *args, **kwargs):
        user = request.user
        post_id = request.data.get('post_id', None)
        value = request.data.get('value', None)
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'detail': 'Post does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post.ratings.get(owner=user)
        except Rating.DoesNotExist:
            rating = post.ratings.create(owner=user, target=post.owner, value=value)
            self.recalc_post_rating(post, value)
            serialized = RatingSerializer(rating)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        return Response({'detail': 'Already rated.'}, status=status.HTTP_400_BAD_REQUEST)
