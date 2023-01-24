from django.db import models

# Create your models here.

class Post(models.Model):
    author = models.CharField(max_length=50)
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)
    title = models.CharField(max_length=200)
    text = models.TextField(max_length=5000)