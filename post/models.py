from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from djangosphinx import SphinxSearch

from authentication.models import Account


class Achievement(models.Model):
    title = models.CharField(max_length=150, blank=True)
    image_url = models.CharField(max_length=150, unique=True)


class Category(models.Model):
    text = models.CharField(max_length=30)


class Tag(models.Model):
    text = models.CharField(max_length=30, unique=True)

    search = SphinxSearch('tag')


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

    tags = models.ManyToManyField(Tag, related_name='posts_for_this_tag')
    category = models.ForeignKey(Category, default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Comment(models.Model):
    owner = models.ForeignKey(Account)
    post = models.ForeignKey(Post)
    content = models.TextField()

    likes = models.ManyToManyField(Like)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


@receiver(post_save, sender=Account)
def check_achievement_1(instance, **kwargs):
    ach = Achievement.objects.get(id=1)
    instance.achievements.add(ach)


@receiver(post_save, sender=Like)
def check_achievement_2(instance, **kwargs):
    ach = Achievement.objects.get(id=2)
    if (len(Like.objects.filter(target=instance.target)) >= 5):
        instance.target.achievements.add(ach)


@receiver(post_save, sender=Post)
def check_achievement_4(instance, **kwargs):
    ach = Achievement.objects.get(id=4)
    if (len(Post.objects.filter(owner=instance.owner)) >= 5):
        instance.owner.achievements.add(ach)


@receiver(post_save, sender=Rating)
def check_achievement_5(instance, **kwargs):
    ach = Achievement.objects.get(id=5)
    if (instance.value == 5):
        instance.target.achievements.add(ach)
