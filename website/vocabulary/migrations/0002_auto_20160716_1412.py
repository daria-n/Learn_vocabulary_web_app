# -*- coding: utf-8 -*-
# Generated by Django 1.10b1 on 2016-07-16 12:12
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vocabulary', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Words',
            new_name='Word',
        ),
    ]
