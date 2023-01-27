from django.urls import path
from . import views
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r"posts", views.PostsViewSet)

urlpatterns = router.urls


# urlpatterns = [
#     # views.getRoutes
#     path("posts/", views.PostsView.as_view(), name="posts"),
#     path("posts/<str:pk>", views.PostView.as_view(), name="post"),
# ]
