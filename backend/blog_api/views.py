from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)

from django.shortcuts import get_object_or_404
from django.core.files.storage import FileSystemStorage
from django.http.request import QueryDict

from .serializers import (
    PostSerializer,
    CommentSerializer,
    LikeSerializer,
    BookmarkSerializer,
    TagSerializer,
)

from core.models import Post, Comment, User, Tag

from rest_framework_simplejwt.authentication import JWTAuthentication

import json


class tags_view(APIView):
    def get(self, request):
        return Response([tag.text for tag in Tag.objects.all()])


class PostsViewSet(ModelViewSet):
    """Viewset for posts."""

    queryset = Post.objects.all().order_by("-created")
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        """For delete and put, the queryset is only the user's posts (not every post)."""
        actions = ["destroy", "update", "partial_update"]
        # /api/blog/posts?user=<user-slug>
        user_filter = self.request.query_params.get("user")
        tags = self.request.query_params.get("tags")
        if tags:
            tags = tags.split(",")

        queryset = super().get_queryset()
        if user_filter:
            queryset = queryset.filter(author__slug=user_filter)
        if tags:
            queryset = queryset.filter(tags__text__in=tags)

        if self.action in actions:
            return queryset.filter(author=self.request.user)
        return queryset

    def get_permissions(self):
        """Only authorized users can post, delete and update."""
        if self.action == "retrieve" or self.action == "list":
            return [permissions.AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_image_urls(self, post_content):
        """Get all the image urls from the post content."""
        r = json.loads(post_content)
        blocks = r["blocks"]
        images = filter(lambda block: block["type"] == "image", blocks)
        image_urls = map(lambda image: image["data"]["file"]["url"], images)
        return list(image_urls)

    def update(self, request, *args, **kwargs):
        """
        When updating a post, the images sent by editorjs in the updated post have to be
        compared with those of the old one, and if one of the old images is not anymore in the
        updated post, it has to be deleted from te filesystem storage.
        """
        instance = self.get_object()

        r_tags = request.data.pop("tags").split(",")
        tags = []
        for tag in r_tags:
            tags.append({"text": tag})
            print("#### TAG: ", tag)
        request.data["tags"] = tags

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        old_image_urls = self.get_image_urls(instance.text)
        new_image_urls = self.get_image_urls(serializer.validated_data["text"])

        fs = FileSystemStorage()
        for image in old_image_urls:
            if image not in new_image_urls:
                image_name = image.split("/")[-1]
                fs.delete(image_name)

        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """When deleting a post, the images that it's content contained also have to be deleted."""
        instance = self.get_object()

        image_urls = self.get_image_urls(instance.text)
        fs = FileSystemStorage()
        for image in image_urls:
            image_name = image.split("/")[-1]
            fs.delete(image_name)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

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
        detail=True,
        authentication_classes=[JWTAuthentication],
        permission_classes=[permissions.IsAuthenticated],
    )
    def bookmark(self, request, pk):
        """
        Bookmark action for bookmarking posts.
        Users need to be authenticated. Allowed methods are DELETE and POST.
        When a user sends a POST request, this action checks if the user has already bookmarked the post.
        If so, a 401 is returned, else, the post is bookmarked. The same happens with DELETE.
        """
        post = Post.objects.get(id=pk)
        isBookmarked = post.bookmarks.filter(user=request.user).exists()
        if request.method == "POST":
            if isBookmarked:
                return Response(
                    {"detail": "The post is already bookmarked."},
                    status.HTTP_401_UNAUTHORIZED,
                )
            else:
                bookmark = post.bookmarks.create(user=request.user)
                post.save()
                serializer = BookmarkSerializer(bookmark)
                return Response(serializer.data, status.HTTP_201_CREATED)
        if request.method == "DELETE":
            if isBookmarked:
                post.bookmarks.get(user=request.user).delete()
                return Response({}, status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"detail": "The post has not been bookmarked."},
                    status.HTTP_401_UNAUTHORIZED,
                )

    @action(
        methods=["POST"],
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
