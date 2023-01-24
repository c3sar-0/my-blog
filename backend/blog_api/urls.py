from django.urls import path
from . import views


urlpatterns = [
    # views.getRoutes
    path("posts/", views.PostsView.as_view(), name="posts"),
    path("posts/<str:pk>", views.PostView.as_view(), name="post"),
]
