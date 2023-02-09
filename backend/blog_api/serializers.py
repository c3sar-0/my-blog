from rest_framework import serializers
from core.models import Post, User, Comment, Like
from user_api.serializers import UserSerializer


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for likes."""

    class Meta:
        model = Like
        fields = "__all__"

    def get_is_liked_by_user(self, obj):
        post = Post.objects.get(id=obj.id)
        return post.likes.filter(author=self.context["request"].user.id).exists()

    def get_likes(self, obj):
        return str(obj.likes.count())


class CommentSerializer(serializers.ModelSerializer):
    """Serialzier for comments."""

    author = UserSerializer(many=False, required=False)
    likes = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()
    image_url = serializers.ImageField(required=False)

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "post", "likes"]

    def get_is_liked_by_user(self, obj):
        """Boolean. True if the user that sent the request has already liked the comment."""
        comment = Comment.objects.get(id=obj.id)
        return comment.likes.filter(author=self.context["request"].user.id).exists()

    def get_likes(self, obj):
        """Number of likes of the comment."""
        return str(obj.likes.count())


class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts."""

    author = UserSerializer(many=False, required=False)
    comments = CommentSerializer(many=True, required=False)
    likes = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "updated"]

    def get_is_liked_by_user(self, obj):
        """Boolean. True if the user that sent the request has already liked the post."""
        post = Post.objects.get(id=obj.id)
        return post.likes.filter(author=self.context["request"].user.id).exists()

    def get_likes(self, obj):
        """Number of likes of the post."""
        return str(obj.likes.count())

    # def to_representation(self, instance):
    #     rep = super().to_representation(instance)
    #     rep["text"] = instance.text.delta
    #     return rep
