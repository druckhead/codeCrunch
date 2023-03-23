from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..views import customviewsets

from ..models import Post, PostSolution
from ..serializers.PostSerializers import (
    PostSerializer,
    CreatePostSerializer,
    PostSolutionSerializer,
    CreatePostSolutionSerializer,
)


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]


class CreatePostViewSet(customviewsets.CreateUpdateDeleteViewSet):
    queryset = Post.objects.all()
    serializer_class = CreatePostSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]


class PostSolutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PostSolution.objects.all()
    serializer_class = PostSolutionSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]


class CreatePostSolutionViewSet(customviewsets.CreateUpdateDeleteViewSet):
    queryset = PostSolution.objects.all()
    serializer_class = CreatePostSolutionSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
