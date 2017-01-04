from django.db import models
from django.contrib.auth.models import User


# Create your models here
class Category(models.Model):
    category = models.CharField(max_length=30, unique=True)
    picture = models.CharField(max_length=500, default='')
    slug = models.SlugField(max_length=30, unique=True)

    def __str__(self):
        return self.category


class Word(models.Model):
    english = models.CharField(max_length=40)
    polish = models.CharField(max_length=60)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.CharField(max_length=300, default='')

    def __str__(self):
        return self.english + " (ang.) - " + self.polish + ", category: " + self.category.category


class Result(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    test_type = models.CharField(max_length=30, blank=True)
    category = models.CharField(max_length=30)
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    score = models.IntegerField(default=0)
    max_possible = models.IntegerField(default=0)

    def __str__(self):
        return str(self.user_id) + ", " + self.category + ": " + str(self.score) + "/" + str(self.max_possible)
