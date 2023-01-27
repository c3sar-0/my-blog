from django.db import models
from user_api.models import User


class Post(models.Model):
    # author = models.CharField(max_length=50)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=200)
    text = models.TextField(max_length=5000)
