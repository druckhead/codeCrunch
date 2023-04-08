from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import User
from ..permissions.userpermissions import UserPermissions
from ..serializers import UserSerializers as serializers


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [UserPermissions]
    serializer_class = serializers.UserSerializer
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        refresh = RefreshToken.for_user(user)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"refresh": str(refresh), "access": str(refresh.access_token)},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.is_staff and not instance.is_active:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.save()

    def get_serializer_class(self):
        if self.action in ("list", "retrieve", "destroy", "update", "partial_update"):
            if self.request.user.is_superuser:
                return serializers.AdminUserSerializer
            return serializers.UserSerializer
        if self.action == "create":
            return serializers.CreateUserSerializer
