from rest_framework import serializers
from django.contrib.auth import get_user_model
from core.models import User, Comment, Like


class UserSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = [
            "name",
            "slug",
            "id",
            "created",
            "last_login",
            "description",
            "profile_picture_url",
        ]
        # fields = [
        #     "name",
        #     "email",
        #     "password",
        #     "profile_picture_url",
        #     "slug",
        #     "id",
        #     "created",
        #     "last_login",
        #     "description",
        #     "number_of_comments",
        #     "number_of_posts",
        #     "wall_comments",
        # ]
        read_only_fields = ["slug", "created", "last_login"]

    def create(self, validated_data):
        """Create and return user with encrypted password."""

        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update and return user."""

        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user

    def get_number_of_comments(self, user):
        return user.comments.count()

    def get_number_of_posts(self, user):
        return user.posts.count()


class UserDetailSerializer(UserSerializer):
    profile_picture_url = serializers.ImageField(required=False)
    number_of_comments = serializers.SerializerMethodField()
    number_of_posts = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = ["is_staff", "is_superuser"]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 8},
        }
        read_only_fields = ["slug", "created", "last_login", "wall_comments"]


class CommentSerializer(serializers.ModelSerializer):
    """Serialzier for comments."""

    likes = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()
    author = UserSerializer(many=False, required=False)

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "wall_user", "likes"]

    def get_is_liked_by_user(self, obj):
        """Boolean. True if the user that sent the request has already liked the comment."""
        # comment = Comment.objects.get(id=obj.id)
        return obj.likes.filter(author=self.context["request"].user.id).exists()

    def get_likes(self, obj):
        """Number of likes of the comment."""
        return str(obj.likes.count())


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for likes."""

    class Meta:
        model = Like
        fields = "__all__"
