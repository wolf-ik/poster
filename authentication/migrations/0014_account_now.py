# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-19 05:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0013_account_is_superuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='now',
            field=models.CharField(blank=True, max_length=10),
        ),
    ]
