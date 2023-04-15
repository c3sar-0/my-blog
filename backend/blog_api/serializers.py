from rest_framework import serializers
from django.core.files.storage import FileSystemStorage
from core.models import Post, Comment, Like, Bookmark, Tag, PostContentImage
from user_api.serializers import UserSerializer
from django_editorjs.fields import EditorJsField
from django.core.exceptions import ValidationError


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for likes."""

    class Meta:
        model = Like
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    """Serialzier for comments."""

    author = UserSerializer(many=False, required=False)
    likes = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()

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


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"
        read_only_fields = ["id"]


class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts."""

    author = UserSerializer(many=False, required=False)
    image_url = serializers.ImageField(
        required=False, allow_empty_file=True, allow_null=True
    )
    likes = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()
    is_bookmarked_by_user = serializers.SerializerMethodField()

    comments = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Post
        # fields = "__all__"
        exclude = ["text"]
        read_only_fields = ["author", "id", "created", "updated"]

    def get_comments(self, obj):
        return obj.comments.count()

    def get_is_liked_by_user(self, obj):
        """Boolean. True if the user that sent the request has already liked the post."""
        post = Post.objects.get(id=obj.id)
        return post.likes.filter(author=self.context["request"].user.id).exists()

    def get_is_bookmarked_by_user(self, obj):
        """Boolean. True if the user that sends the request has already bookmarked the post."""
        post = Post.objects.get(id=obj.id)
        return post.bookmarks.filter(user__id=self.context["request"].user.id).exists()

    def get_likes(self, obj):
        """Number of likes of the post."""
        return str(obj.likes.count())

    def validate_image_url(self, image):
        print("######### IMAGE: ", type(image))
        if image.size > 2 * 1024 * 1024:
            raise ValidationError("The maximum image size that can be uploaded is 2MB")
        return image


class PostDetailSerializer(PostSerializer):
    # comments = CommentSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "updated"]

    def create(self, validated_data):
        tags = validated_data.pop("tags", None)
        post = Post.objects.create(**validated_data)
        if tags:
            for tag in tags:
                obj, created = Tag.objects.get_or_create(text=tag["text"])
                post.tags.add(obj)

        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        if tags:
            instance.tags.clear()
            for tag in tags:
                obj, created = Tag.objects.get_or_create(text=tag["text"])
                instance.tags.add(obj)
        else:
            instance.tags.clear()

        fs = FileSystemStorage()
        if "image_url" not in validated_data.keys() and instance.image_url:
            fs.delete(instance.image_url.name)
            instance.image_url.delete()
        elif (
            "image_url" in validated_data.keys()
            and instance.image_url
            and instance.image_url.url != validated_data["image_url"]
        ):
            fs.delete(instance.image_url.name)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            instance.save()

        return instance


class PostContentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostContentImage
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        content_image = PostContentImage.objects.create(
            **validated_data, user=self.context["request"].user
        )
        return content_image


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = "__all__"
        read_only_fields = ["user", "post"]
