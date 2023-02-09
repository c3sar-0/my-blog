from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import get_object_or_404
from django.core.files.storage import FileSystemStorage

from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from core.models import Post, Comment

from rest_framework_simplejwt.authentication import JWTAuthentication


class PostsViewSet(ModelViewSet):
    """Viewset for posts."""

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser]

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

    @action(
        methods=["POST", "DELETE"],
        detail=True,
        authentication_classes=[JWTAuthentication],
        permission_classes=[permissions.IsAuthenticated],
    )
    def like(self, request, pk):
        """
            Like action for posts.
        Users need to be authenticated. Allowed methods are DELETE and POST.
        When a user sends a POST request, this action checks if the user has already liked the post.
        If so, a 401 is returned, else, the post is liked. The same happens with DELETE.
        """
        post = Post.objects.get(id=pk)
        isLiked = post.likes.filter(author=request.user).exists()
        if request.method == "POST":
            if isLiked:
                return Response(
                    {"detail": "The post is already liked."},
                    status.HTTP_401_UNAUTHORIZED,
                )
            else:
                like = post.likes.create(author=request.user)
                post.save()
                serializer = LikeSerializer(like)
                return Response(serializer.data, status.HTTP_201_CREATED)
        if request.method == "DELETE":
            if isLiked:
                post.likes.get(author=request.user).delete()
                return Response({}, status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"detail": "The post has not been liked."},
                    status.HTTP_401_UNAUTHORIZED,
                )

    @action(
        methods=["POST", "DELETE"],
        detail=False,
        authentication_classes=[JWTAuthentication],
        permission_classes=[permissions.AllowAny],
    )
    def file_upload(self, request):
        print("#################: ", request.body)
        f = request.FILES["image"]
        fs = FileSystemStorage()
        filename = str(f).split(".")[0]
        file = fs.save(filename, f)
        file_url = fs.url(file)
        return Response(
            {"success": "1", "file": {"url": f"http://localhost:8000{file_url}"}},
            status.HTTP_201_CREATED,
        )


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

    @action(
        methods=["POST", "DELETE"],
        detail=True,
        authentication_classes=[JWTAuthentication],
        permission_classes=[permissions.IsAuthenticated],
    )
    def like(self, request, post_pk, pk):
        """Like action for comments."""
        # post = Post.objects.get(id=post_pk)
        post = get_object_or_404(Post.objects.all(), id=post_pk)
        # comment = post.comments.get(id=pk)
        comment = get_object_or_404(post.comments, id=pk)
        isLiked = comment.likes.filter(author=request.user).exists()
        if request.method == "POST":
            if isLiked:
                return Response(
                    {"detail": "The post is already liked."},
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
                    {"detail": "The post has not been liked."},
                    status.HTTP_401_UNAUTHORIZED,
                )
