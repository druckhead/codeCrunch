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
        # TODO add user id to post on create
        return super().create(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return serializers.PostSerializer
        elif self.action in ("update", "partial_update", "create"):
            return serializers.CreatePostSerializer


class PostSolutionViewSet(viewsets.ModelViewSet):
    queryset = PostSolution.objects.all()
    serializer_class = serializers.PostSolutionSerializer
    permission_classes = [PostSolutionPermissions, BaseCUDPermission]
    authentication_classes = [JWTAuthentication]

    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        request_data["user_id"] = request.user.id
        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return serializers.PostSolutionSerializer
        elif self.action in ("update", "partial_update", "create"):
            return serializers.CreatePostSolutionSerializer
