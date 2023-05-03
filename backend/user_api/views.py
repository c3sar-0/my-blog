from django.shortcuts import get_object_or_404

from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.models import User, Comment, Notification
from .serializers import (
    UserSerializer,
    UserDetailSerializer,
    CommentSerializer,
    LikeSerializer,
    NotificationSerializer,
)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if (
            self.action == "update"
            or self.action == "partial_update"
            or self.action == "destroy"
        ):
            return super().get_permissions()
        return [permissions.AllowAny()]

    def get_object(self):
        if (
            self.action == "update"
            or self.action == "partial_update"
            or self.action == "destroy"
        ):
            return get_object_or_404(User.objects.all(), id=self.request.user.id)
        return get_object_or_404(User.objects.all(), slug=self.kwargs["pk"])

    def get_serializer_class(self):
        actions = ["retrieve", "update", "partial_update", "destroy", "create"]
        if self.action in actions:
            return UserDetailSerializer
        return UserSerializer


class MeView(RetrieveUpdateDestroyAPIView):
    """View for getting authenticated user."""

    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        return self.request.user


class CommentsViewSet(ModelViewSet):
    """Viewset for comments. User and comment pk here are accessed through self.kwargs['user_pk'/'comment_pk']"""

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """For delete and put, the queryset is only the user's comments."""
        actions = ["destroy", "update", "partial_update"]
        wall_user = User.objects.get(slug=self.kwargs["user_pk"])
        queryset = wall_user.wall_comments.all()
        if self.action in actions:
            queryset.filter(author=self.request.user)
        return queryset

    def get_permissions(self):
        "Only authorized users can comment, delete and update."
        if self.action == "retrieve" or self.action == "list":
            return [permissions.AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        author = self.request.user
        # wall_user = User.objects.get(id=self.kwargs["user_pk"])
        wall_user = User.objects.get(slug=self.kwargs["user_pk"])
        serializer.save(author=author, wall_user=wall_user)

    @action(
        methods=["POST", "DELETE"],
        detail=True,
        authentication_classes=[JWTAuthentication],
        permission_classes=[permissions.IsAuthenticated],
    )
    def like(self, request, user_pk, pk):
        """Like action for comments."""

        user = get_object_or_404(User.objects.all(), slug=user_pk)
        comment = get_object_or_404(user.wall_comments, id=pk)
        isLiked = comment.likes.filter(author=request.user).exists()
        if request.method == "POST":
            if isLiked:
                return Response(
                    {"detail": "The comment is already liked."},
                    status.HTTP_401_UNAUTHORIZED,
                )
            else:
                like = comment.likes.create(author=request.user)
                comment.save()
                serializer = LikeSerializer(like)
                return Response(serializer.data, status.HTTP_201_CREATED)
        if request.method == "DELETE":
            if isLiked:
                comment.likes.get(author=request.user).delete()
                return Response({}, status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"detail": "The comment has not been liked."},
                    status.HTTP_401_UNAUTHORIZED,
                )


class NotificationView(ListAPIView):
    """View for getting authenticated user's notifications"""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.isAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
