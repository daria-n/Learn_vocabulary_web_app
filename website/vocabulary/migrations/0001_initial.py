# -*- coding: utf-8 -*-
# Generated by Django 1.10b1 on 2016-07-16 11:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Words',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('english', models.CharField(max_length=40)),
                ('polish', models.CharField(max_length=60)),
                ('description', models.CharField(max_length=300)),
            ],
        ),
    ]
