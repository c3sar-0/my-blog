from django.urls import path, include
from . import views
from rest_framework_nested import routers

# SUPPORTED URLS:
# /api/blog/posts/
# /api/blog/posts/id/
# /api/blog/posts/id/comments/
# /api/blog/posts/id/comments/id/

router = routers.SimpleRouter()
router.register("posts", views.PostsViewSet)

posts_router = routers.NestedSimpleRouter(router, r"posts", lookup="post")
posts_router.register(r"comments", views.CommentsViewSet, basename="post-comments")

urlpatterns = [path(r"", include(router.urls)), path(r"", include(posts_router.urls))]


# router = routers.SimpleRouter()
# router.register(r"posts", views.PostsViewSet)

# urlpatterns = router.urls

# print(
#     "URL PATTERNS: ", urlpatterns
# )  # -> [<URLPattern '^posts/$' [name='post-list']>, <URLPattern '^posts/(?P<pk>[^/.]+)/$' [name='post-detail']>]
