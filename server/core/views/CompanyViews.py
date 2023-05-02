from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Company
from ..permissions.basepermissions import BaseCUDPermission
from ..permissions.companypermissions import CompanyPermissions
from ..serializers import CompanySerializers as serializers


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = serializers.CompanySerializer
    # permission_classes = [CompanyPermissions, BaseCUDPermission]
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return serializers.CompanySerializer
        elif self.action in ("update", "partial_update", "create"):
            return serializers.CreateCompanySerializer
