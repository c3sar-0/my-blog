from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from .serializers import PostSerializer, CommentSerializer, LikeSerializer
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

    @action(
        methods=["POST"],
        detail=True,
        authentication_classes=[JWTAuthentication],
        permission_classes=[permissions.IsAuthenticated],
    )
    def like(self, request, pk):
        """
            Like action for posts.
        Users need to be authenticated and only allowed method is POST.
        If the user has already liked the post, the like will be deleted.
        I should probably change this approach since it's not RESTFUL at all.
        """
        post = Post.objects.get(id=pk)
        isLiked = post.likes.filter(author=request.user).exists()
        if isLiked:
            post.likes.get(author=request.user).delete()
            return Response({}, status.HTTP_204_NO_CONTENT)
        like = post.likes.create(author=request.user)
        post.save()
        serializer = LikeSerializer(like)
        return Response(serializer.data, status.HTTP_201_CREATED)


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
        methods=["POST"],
        detail=True,
        authentication_classes=[JWTAuthentication],
        permission_classes=[permissions.IsAuthenticated],
    )
    def like(self, request, post_pk, pk):
        """Like action for comments."""
        post = Post.objects.get(id=post_pk)
        comment = post.comments.get(id=pk)
        isLiked = comment.likes.filter(author=request.user).exists()
        if isLiked:
            comment.likes.get(author=request.user).delete()
            return Response({}, status.HTTP_204_NO_CONTENT)
        like = comment.likes.create(author=request.user)
        comment.save()
        serializer = LikeSerializer(like)
        return Response(serializer.data, status.HTTP_201_CREATED)


# Old like implementation (I changed it mid-work)
# @action(authentication_classes=[JWTAuthentication], permission_classes=[permissions.IsAuthenticated])
# def like(self, request, post__pk):
#     """Custom action for liking posts. /api/blog/posts/pk/like/
#     This is the GET method, which returns the likes (you get the likes of a post/comment when you get the post/comment, so this method is not really suppossed to be used and is here just to be able make the mappings)."""
#     likes = Like.objects.filter(post__id=post__pk)
#     serializer = LikeSerializer(likes, many=True)
#     return Response(serializer.data, status.HTTP_200_OK)

# @like.mapping.post
# def like_post(self, request, post__pk):
#     """POST method for like action."""
#     post = Post.objects.get(id=post__pk)
#     like = post.likes.add(author=request.user)
#     serializer = LikeSerializer(like)
#     return Response(serializer.data, status.HTTP_201_CREATED)

# @like.mapping.delete
# def like_post(self, request, post__pk):
#     """DELETE method for like action."""
#     like =
