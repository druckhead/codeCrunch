from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Post, PostSolution
from ..serializers import PostSerializers as serializers


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return serializers.PostSerializer
        elif self.action in ("update", "partial_update", "create"):
            return serializers.CreatePostSerializer


class PostSolutionViewSet(viewsets.ModelViewSet):
    queryset = PostSolution.objects.all()
    serializer_class = serializers.PostSolutionSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return serializers.PostSolutionSerializer
        elif self.action in ("update", "partial_update", "create"):
            return serializers.CreatePostSolutionSerializer
