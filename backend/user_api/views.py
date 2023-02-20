from rest_framework.views import APIView
from rest_framework.generics import (
    RetrieveUpdateDestroyAPIView,
    CreateAPIView,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.models import User
from .serializers import UserSerializer


class CreateUserView(CreateAPIView):
    """View for creating a user."""

    serializer_class = UserSerializer


class GetUserView(APIView):
    """View for getting a user."""

    def get(self, request, slug):
        user = User.objects.get(slug=slug)
        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


class MeView(RetrieveUpdateDestroyAPIView):
    """View for getting authenticated user."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        return self.request.user
