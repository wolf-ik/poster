from rest_framework import serializers

from post.models import Post, Comment, Like, Rating, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'text')
        depth = 0


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'owner', 'name', 'title', 'content',
                  'ratings', 'rating', 'ratings_count', 'tags',
                  'created_at', 'updated_at')
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


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'owner', 'value')
        depth = 0
