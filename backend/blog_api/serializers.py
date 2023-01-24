from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts."""
    class Meta:
        model = Post
        fields = ['title', 'text', 'author', 'id', 'created', 'updated']
        read_only_fields = ['author', 'id', 'created', 'updated']