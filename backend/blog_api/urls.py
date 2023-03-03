from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_nested import routers

from . import views

# SUPPORTED URLS:
# /api/blog/posts/
# /api/blog/posts/id/
# /api/blog/posts/id/comments/
# /api/blog/posts/id/comments/id/

router = routers.SimpleRouter()
router.register("posts", views.PostsViewSet)

posts_router = routers.NestedSimpleRouter(router, r"posts", lookup="post")
posts_router.register(r"comments", views.CommentsViewSet, basename="post-comments")

urlpatterns = [
    path(r"", include(router.urls)),
    path(r"", include(posts_router.urls)),
]  # + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [path("tags/", views.tags_view.as_view())]
