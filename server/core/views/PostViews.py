from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Post, PostSolution
from ..permissions.basepermissions import BaseCUDPermission
from ..permissions.postpermissions import PostPermissions, PostSolutionPermissions
from ..serializers import PostSerializers as serializers


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [PostPermissions, BaseCUDPermission]
    authentication_classes = [JWTAuthentication]

    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_queryset(self):
        if self.action == "list":
            if not self.request.user.is_superuser:
                return Post.objects.filter(user_id=self.request.user.id)
        return super().get_queryset()

    def get_serializer_class(self):
        if self.action in ("list", "retrieve", "destroy"):
            return serializers.PostSerializer
        elif self.action == "create":
            return serializers.CreatePostSerializer
        if self.action in ("update", "partial_update"):
            return serializers.UpdatePostSerializer


class PostSolutionViewSet(viewsets.ModelViewSet):
    queryset = PostSolution.objects.all()
    serializer_class = serializers.PostSolutionSerializer
    permission_classes = [PostSolutionPermissions, BaseCUDPermission]
    authentication_classes = [JWTAuthentication]

    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_queryset(self):
        if self.action == "list":
            if not self.request.user.is_superuser:
                return PostSolution.objects.filter(user_id=self.request.user.id)
        return super().get_queryset()

    def get_serializer_class(self):
        if self.action in ("list", "retrieve", "destroy"):
            return serializers.PostSolutionSerializer
        if self.action == "create":
            return serializers.CreatePostSolutionSerializer
        if self.action in ("update", "partial_update"):
            return serializers.UpdatePostSolutionSerializer
