from rest_framework import serializers

from post.models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'owner', 'name', 'title', 'content', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
        depth = 1


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'owner', 'likes', 'post', 'content', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
        depth = 1


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id', 'owner')
        depth = 0