from rest_framework import serializers
from core.models import Post, User, Comment
from user_api.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts."""

    author = UserSerializer(many=False, required=False)

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "updated"]

    # def create(self, validated_data):
    #     author = self.context["request"].user
    #     # authorSerializer = UserSerializer(author)
    #     post = Post.objects.create(**validated_data, author=author)
    #     return post


class CommentSerializer(serializers.ModelSerializer):
    """Serialzier for comments."""

    # author = UserSerializer(many=False, required=False)
    # post = PostSerializer(many=False, required=False)

    ### TODO: customizar la data del serializer. Devuelve todito el post object entero, hacer que solo devuelva la id (igual con el author).
    ### Hacer lo mismo en el post serializer tambien y revisar el del author.
    ### UPDATE: se arregla simplemente sacando los serializers definidos arriba (author=UserSerializer, post=Post...)
    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "post"]
