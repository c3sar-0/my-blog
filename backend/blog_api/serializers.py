from rest_framework import serializers
from core.models import Post, Comment, Like, Bookmark, Tag
from user_api.serializers import UserSerializer


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for likes."""

    class Meta:
        model = Like
        fields = "__all__"

    # def get_is_liked_by_user(self, obj):
    #     post = Post.objects.get(id=obj.id)
    #     return post.likes.filter(author=self.context["request"].user.id).exists()

    # def get_likes(self, obj):
    #     return str(obj.likes.count())


class CommentSerializer(serializers.ModelSerializer):
    """Serialzier for comments."""

    author = UserSerializer(many=False, required=False)
    likes = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()
    # image_url = serializers.ImageField(required=False) ?? why did I put this here

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
    image_url = serializers.ImageField(required=False)
    comments = CommentSerializer(many=True, required=False)
    likes = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()
    is_bookmarked_by_user = serializers.SerializerMethodField()

    tags = TagSerializer(many=True, required=False)

    # tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["author", "id", "created", "updated"]

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

    def create(self, validated_data):
        tags = validated_data.pop("tags", "")
        post = Post.objects.create(**validated_data)

        if tags:
            for tag in tags:
                obj, created = Tag.objects.get_or_create(text=tag)
                post.tags.add(obj)

        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        if tags:
            instance.tags.clear()
            for tag in tags:
                obj, created = Tag.objects.get_or_create(text=tag["text"])
                instance.tags.add(obj)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            instance.save()

        return instance

    # def to_representation(self, instance):
    #     rep = super().to_representation(instance)
    #     rep["text"] = instance.text.delta
    #     return rep


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = "__all__"
        read_only_fields = ["user", "post"]
