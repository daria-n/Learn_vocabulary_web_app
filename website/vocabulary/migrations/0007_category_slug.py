# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-03 15:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vocabulary', '0006_category_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='slug',
            field=models.SlugField(default='animals', max_length=30),
        ),
    ]
