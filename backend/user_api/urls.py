from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework_nested import routers


router = routers.SimpleRouter()
router.register("users", views.UserViewSet)

user_router = routers.NestedSimpleRouter(router, r"users", lookup="user")
user_router.register(r"comments", views.CommentsViewSet, basename="user-wall-comments")

urlpatterns = [
    path(r"", include(router.urls)),
    path(r"", include(user_router.urls)),
] + [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", views.MeView.as_view(), name="me"),
]
