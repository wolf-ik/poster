from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response

from post.models import Post, Comment, Like, Rating
from post.serializers import PostSerializer, CommentSerializer, LikeSerializer, RatingSerializer
from post.permissions import IsObjectOwnerOrAdmin


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsObjectOwnerOrAdmin)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        return super(PostViewSet, self).perform_create(serializer)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.order_by('-create_at')
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsObjectOwnerOrAdmin)

    def list(self, request, *args, **kwargs):
        post_id = request.query_params.get('post_id', None)
        self.queryset = Comment.objects.filter(post_id=post_id)
        return super(CommentViewSet, self).list(request, *args, **kwargs)

    def perform_create(self, serializer):
        post = Post.objects.get(id=self.request.data.get('post_id', None))
        serializer.save(owner=self.request.user,
                        post=post)
        return super(CommentViewSet, self).perform_create(serializer)


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

    def recalc_post_rating(self, post, value):
        rating = post.rating
        count = post.ratings_count
        new_rating = (rating * count + value) / (count + 1)
        post.rating = new_rating
        post.ratings_count = count + 1
        post.save()