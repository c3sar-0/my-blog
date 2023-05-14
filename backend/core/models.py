from django.db import models
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django_editorjs import EditorJsField
from django.utils.text import slugify

from commons.get_image_urls import get_image_urls

import os


class UserManager(BaseUserManager):
    """Custom user manager."""

    def create_user(self, email, password=None, **other):
        """Create and return a user."""

        if not email:
            raise ValueError("Email is required.")
        user = self.model(email=self.normalize_email(email), **other)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create and return a superuser."""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model. The primary key is the slugified name."""

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=100, unique=True)
    profile_picture_url = models.ImageField(upload_to="users", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    slug = models.SlugField(null=False, unique=True)
    description = models.TextField(max_length=1000, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Post(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="posts"
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=150, default="default title")
    text = EditorJsField(
        editorjs_config={
            "tools": {
                "image": {
                    "config": {
                        "endpoints": {
                            "byFile": os.environ.get("API_URL")
                            + "api/blog/posts/file_upload/"
                        },
                        "additionalRequestHeaders": [
                            {"Content-Type": "multipart/form-data"}
                        ],
                    }
                },
            }
        }
    )
    image_url = models.ImageField(
        upload_to="posts", null=True, blank=True
    )  # This should be called cover_image
    tags = models.ManyToManyField("Tag", blank=True, null=True)

    def delete(self, *args, **kwargs):
        fs = FileSystemStorage()
        if self.image_url:
            fs.delete(self.image_url.name)

        content_img_urls = get_image_urls(self.text)
        for img in content_img_urls:
            image_name = img.split("/")[-1]
            fs.delete(image_name)
        return super().delete(*args, **kwargs)


class PostContentImage(models.Model):
    """Model for the posts' content images, NOT the cover image."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="images")
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="images", null=True
    )
    url = models.CharField(max_length=255, null=False, blank=False)


class Comment(models.Model):
    """Comment model. It can be a post comment OR a user's wall comment. Comments can also be answers to other comments."""

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    created = models.DateTimeField(auto_now_add=True)
    text = models.TextField(max_length=500)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, null=True, related_name="comments"
    )
    wall_user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="wall_comments"
    )
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, related_name="children"
    )
    depth = models.IntegerField(null=True)
    outermost_parent_id = models.IntegerField(null=True)

    def get_outermost_parent_id(self):
        def get_next_parent(comment):
            if (comment.parent) is None:
                return comment.id
            else:
                return get_next_parent(comment.parent)

        return get_next_parent(self)

    def calculate_depth(self):
        depth = -1

        def calculate_outermost_parent_depth(c):
            nonlocal depth
            if c == None:
                return depth
            else:
                depth += 1
                return calculate_outermost_parent_depth(c.parent)

        return calculate_outermost_parent_depth(self)

    def save(self, *args, **kwargs):
        self.depth = self.calculate_depth()
        self.outermost_parent_id = self.get_outermost_parent_id()
        super().save(*args, **kwargs)


class Like(models.Model):
    """Like model for posts and comments."""

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, null=True, related_name="likes"
    )
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, null=True, related_name="likes"
    )


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookmarks")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="bookmarks")
    created = models.DateTimeField(auto_now_add=True, null=True)


class Tag(models.Model):
    text = models.TextField(max_length=10)


class Notification(models.Model):
    """Notification model. There are post and wall notifications. If the notification has a null post, then it is a wall notification."""

    NOTIFICATION_TYPES = (
        ("wall_comment", "Wall comment"),
        ("wall_comment_like", "Wall comment like"),
        ("post_like", "Post like"),
        ("post_comment", "Post comment"),
        ("post_comment_like", "Post comment like"),
    )
    # User that will receive the notification
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    created = models.DateField(auto_now_add=True)
    seen = models.BooleanField(default=False)
    notification_type = models.CharField(
        choices=NOTIFICATION_TYPES, max_length=50, null=True
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    author_name = models.CharField(max_length=100, null=True)

    # comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)


# class CommentNotification(Notification):
#     """Comment notification model. It can refer to a comment like or a new comment (the last can be a wall comment or a post comment)."""

#     comment = models.ForeignKey(Comment, on_delete=models.CASCADE)


# class PostLikeNotification(Notification):
#     """Post notification model. I"""

#     post = models.ForeignKey(Post, on_delete=models.CASCADE)
