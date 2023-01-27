from rest_framework import serializers
from .models import Post
from user_api.models import User
from user_api.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts."""

    author = UserSerializer(many=False, required=False)

    class Meta:
        model = Post
        fields = ["title", "text", "author", "id", "created", "updated"]
        read_only_fields = ["author", "id", "created", "updated"]

    def create(self, validated_data):
        author = self.context["request"].user
        # authorSerializer = UserSerializer(author)
        post = Post.objects.create(**validated_data, author=author)
        return post
