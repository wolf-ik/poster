from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response

from post.models import Post, Comment, Like
from post.serializers import PostSerializer, CommentSerializer, LikeSerializer
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
    serializer_class =LikeSerializer
    permission_classes = (permissions.IsAuthenticated, IsObjectOwnerOrAdmin)

    def create(self, request, *args, **kwargs):
        user = request.user
        comment_id = request.data.get('comment_id', None)
        try:
            comment = Comment.objects.get(id=comment_id)
        except:
            return Response({'detail': 'Comment does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            comment.likes.get(owner=user)
        except:
            like = comment.likes.create(owner=user)
            serialized = LikeSerializer(like)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        return Response({'detail': 'Already liked.'}, status=status.HTTP_400_BAD_REQUEST)