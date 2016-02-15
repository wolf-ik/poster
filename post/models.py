from __future__ import unicode_literals

from django.db import models
from authentication.models import Account


class Post(models.Model):
    owner = models.ForeignKey(Account)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=300)
    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)