from rest_framework import serializers

from authentication.serializers import AccountSerializer
from post.models import Post, Comment, Like, Rating, Tag, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'text')


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'text')


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id', 'owner')


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'owner', 'value')


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'owner', 'name', 'title', 'content',
                  'ratings', 'rating', 'ratings_count', 'tags',
                  'category', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1


class PostShowSerializer(PostSerializer):
    owner = AccountSerializer()
    ratings = RatingSerializer(many=True)
    tags = TagSerializer(many=True)

    class Meta(PostSerializer.Meta):
        depth = 1


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'owner', 'likes', 'post', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1


class CommentShowSerializer(CommentSerializer):
    owner = AccountSerializer()
    likes = LikeSerializer(many=True)

    class Meta(CommentSerializer.Meta):
        depth = 0
