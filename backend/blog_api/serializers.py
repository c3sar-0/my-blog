from rest_framework import serializers
from core.models import Post, User, Comment, Like
from user_api.serializers import UserSerializer


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    """Serialzier for comments."""

    author = UserSerializer(many=False, required=False)
    likes = LikeSerializer(many=True, required=False)

    ### TODO: customizar la data del serializer. Devuelve el post object entero, hacer que solo devuelva la id (igual con el author).
    ### Hacer lo mismo en el post serializer tambien y revisar el del author.
    ### UPDATE: se arregla simplemente sacando los serializers definidos arriba (author=UserSerializer, post=Post...)
    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "post", "likes"]


class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts."""

    author = UserSerializer(many=False, required=False)
    comments = CommentSerializer(many=True, required=False)
    likes = LikeSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "updated", "likes"]
