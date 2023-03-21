from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import User
from ..serializers.UserSerializers import UserSerializer, CreateUserSerializer
from . import customviewsets


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]


class CreateUserViewSet(customviewsets.CreateUpdateDeleteViewSet):
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
