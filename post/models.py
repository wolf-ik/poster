from __future__ import unicode_literals

from django.db import models
from djangosphinx import SphinxSearch

from authentication.models import Account


class Tag(models.Model):
    text = models.CharField(max_length=30, unique=True)


class Like(models.Model):
    owner = models.ForeignKey(Account)
    target = models.ForeignKey(Account, related_name='like_target')


class Rating(models.Model):
    owner = models.ForeignKey(Account)
    target = models.ForeignKey(Account, related_name='rating_target')

    value = models.IntegerField()


class Post(models.Model):
    owner = models.ForeignKey(Account)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=300)
    content = models.TextField()

    rating = models.FloatField(default=0)
    ratings_count = models.IntegerField(default=0)
    ratings = models.ManyToManyField(Rating)

    tags = models.ManyToManyField(Tag)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    search = SphinxSearch('post')


class Comment(models.Model):
    owner = models.ForeignKey(Account)
    post = models.ForeignKey(Post)
    content = models.TextField()

    likes = models.ManyToManyField(Like)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)