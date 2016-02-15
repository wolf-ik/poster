from rest_framework import viewsets, permissions

from post.models import Post
from post.serializers import PostSerializer
from post.permissions import IsAccountOwnerOrAdmin


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsAccountOwnerOrAdmin)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        return super(PostViewSet, self).perform_create(serializer)
