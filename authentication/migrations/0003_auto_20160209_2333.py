# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-09 23:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_account_is_staff'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='is_staff',
        ),
        migrations.RemoveField(
            model_name='account',
            name='tagline',
        ),
        migrations.AddField(
            model_name='account',
            name='best_qoute',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='interests',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='email',
            field=models.EmailField(max_length=80, unique=True),
        ),
    ]
