from rest_framework import serializers
from django.contrib.auth import get_user_model
from core.models import User


class UserSerializer(serializers.ModelSerializer):

    # profile_picture_url = serializers.SerializerMethodField()
    profile_picture_url = serializers.ImageField(required=False)
    number_of_comments = serializers.SerializerMethodField()
    number_of_posts = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "password",
            "profile_picture_url",
            "slug",
            "id",
            "created",
            "last_login",
            "description",
            "number_of_comments",
            "number_of_posts",
        ]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 8},
        }
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
