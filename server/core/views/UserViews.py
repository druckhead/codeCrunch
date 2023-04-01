from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import User
from ..permissions.userpermissions import UserPermissions
from ..serializers import UserSerializers as serializers


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [UserPermissions]
    serializer_class = serializers.UserSerializer
    authentication_classes = [JWTAuthentication]

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
        if self.action in ("list", "retrieve"):
            if self.request.user.is_superuser:
                return serializers.AdminUserSerializer
            return serializers.UserSerializer
        elif self.action in ("update", "partial_update", "create", "destroy"):
            return serializers.CreateUserSerializer
