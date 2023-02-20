from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django_editorjs import EditorJsField
from django.utils.text import slugify


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
    """Custom user model."""

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=100, unique=True)
    profile_picture_url = models.ImageField(upload_to="users/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    slug = models.SlugField(null=False, unique=True, default="")

    objects = UserManager()

    USERNAME_FIELD = "email"

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=150, default="default title")
    text = EditorJsField(
        editorjs_config={
            "tools": {
                "image": {
                    "config": {
                        "endpoints": {
                            "byFile": "http://localhost:8000/api/blog/posts/file_upload/"
                        },
                        "additionalRequestHeaders": [
                            {"Content-Type": "multipart/form-data"}
                        ],
                    }
                },
            }
        }
    )

    image_url = models.ImageField(upload_to="posts", null=True, blank=True)


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, null=True, related_name="comments"
    )
    created = models.DateTimeField(auto_now_add=True)
    text = models.TextField(max_length=500)


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
