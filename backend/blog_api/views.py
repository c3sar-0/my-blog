from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework import status

from .serializers import PostSerializer, CommentSerializer
from core.models import Post, Comment

from rest_framework_simplejwt.authentication import JWTAuthentication


class PostsViewSet(ModelViewSet):
    """Viewset for posts."""

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """For delete and put, the queryset is only the user's posts (not every post)."""
        actions = ["destroy", "update", "partial_update"]
        if self.action in actions:
            return Post.objects.filter(author=self.request.user)
        return super().get_queryset()

    def get_permissions(self):
        "Only authorized users can post, delete and update."
        if self.action == "retrieve" or self.action == "list":
            return [permissions.AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentsViewSet(ModelViewSet):
    """Viewset for comments. Post and comment pk here are accessed through self.kwargs['post_pk'/'comment_pk']"""

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """For delete and put, the queryset is only the user's comments."""
        actions = ["destroy", "update", "partial_update"]
        if self.action in actions:
            return Comment.objects.filter(author=self.request.user)
        return super().get_queryset()

    def get_permissions(self):
        "Only authorized users can comment, delete and update."
        if self.action == "retrieve" or self.action == "list":
            return [permissions.AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        author = self.request.user
        post = Post.objects.get(id=self.kwargs["post_pk"])
        serializer.save(author=author, post=post)
