from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import User
from ..permissions.userpermissions import UserPermissions
from ..serializers import UserSerializers as serializers


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [UserPermissions]
    serializer_class = serializers.UserSerializer
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            if self.request.user.is_superuser:
                return serializers.AdminUserSerializer
            return serializers.UserSerializer
        elif self.action in ("update", "partial_update", "create"):
            return serializers.CreateUserSerializer
