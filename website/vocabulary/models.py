from django.db import models


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
