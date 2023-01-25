from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import PostSerializer
from .models import Post


class PostsView(APIView):
    def get(self, request):
        posts = Post.objects.order_by("-created")
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class PostView(APIView):
    def get(self, request, pk):
        posts = Post.objects.get(id=pk)
        serializer = PostSerializer(posts)
        return Response(serializer.data, status.HTTP_200_OK)

    def put(self, request, pk):
        post = Post.objects.get(id=pk)
        serializer = PostSerializer(instance=post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        Post.objects.get(id=pk).delete()
        return Response({}, status.HTTP_204_NO_CONTENT)
