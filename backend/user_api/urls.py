from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("create/", views.CreateUserView.as_view(), name="user"),
    path("me/", views.MeView.as_view(), name="me"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    #
    path("<str:name>/", views.GetUserView.as_view()),
    #
]
