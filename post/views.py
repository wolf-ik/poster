from rest_framework import viewsets, permissions

from post.models import Post, Comment
from post.serializers import PostSerializer, CommentSerializer
from post.permissions import IsAccountOwnerOrAdmin


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsAccountOwnerOrAdmin)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        return super(PostViewSet, self).perform_create(serializer)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.order_by('-create_at')
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsAccountOwnerOrAdmin)

    def list(self, request, *args, **kwargs):
        post_id = request.query_params.get('post_id', None)
        self.queryset = Comment.objects.filter(post_id=post_id)
        return super(CommentViewSet, self).list(request, *args, **kwargs)

    def perform_create(self, serializer):
        post = Post.objects.get(id=self.request.data.get('post_id', None))
        serializer.save(owner=self.request.user,
                        post=post)
        return super(CommentViewSet, self).perform_create(serializer)