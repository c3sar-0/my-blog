from rest_framework.generics import (
    RetrieveUpdateDestroyAPIView,
    ListCreateAPIView,
)
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins

from .serializers import PostSerializer
from .models import Post

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

    # def perform_create(self, serializer):
    #     serializer.save(author=self.request.user)


# class PostsView(ListCreateAPIView):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
#     permission_classes = [permissions.IsAuthenticated]
#     authentication_classes = [TokenAuthentication]

#     def get_permissions(self):
#         if self.request.method == "GET":
#             return [permissions.AllowAny()]
#         return super().get_permissions()


# class PostView(RetrieveUpdateDestroyAPIView):
#     serializer_class = PostSerializer
#     queryset = Post.objects.all()
#     permission_classes = [permissions.IsAuthenticated]
#     authentication_classes = [TokenAuthentication]

#     def get_permissions(self):
#         authMethods = ["POST", "PUT", "DELETE"]
#         if self.request.method not in authMethods:
#             return [permissions.AllowAny()]
#         return super().get_permissions()

#     def get_queryset(self):
#         authMethods = ["POST", "PUT", "DELETE"]
#         if self.request.method in authMethods:
#             return Post.objects.filter(author=self.request.user)
#         return super().get_queryset()
