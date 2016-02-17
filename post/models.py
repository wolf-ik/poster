from __future__ import unicode_literals

from django.db import models
from djangosphinx import SphinxSearch

from authentication.models import Account


class Post(models.Model):
    owner = models.ForeignKey(Account)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=300)
    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    search = SphinxSearch('post')


class Like(models.Model):
    owner = models.ForeignKey(Account)


class Comment(models.Model):
    owner = models.ForeignKey(Account)
    post = models.ForeignKey(Post)
    content = models.TextField()

    likes = models.ManyToManyField(Like)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)