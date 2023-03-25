from django.core.serializers import get_serializer
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import User
from ..serializers import UserSerializers as serializers


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return serializers.UserSerializer
        elif self.action in ("update", "partial_update", "create"):
            return serializers.CreateUserSerializer
