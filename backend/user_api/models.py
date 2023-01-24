from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


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
        user = self.create_user(
            email, password
        )  # DANGEROUS? what if I send a request to create_user and in **other I pass is_superuser: True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model."""

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
