from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Company
from ..serializers.CompanySerializers import CompanySerializer, CreateCompanySerializer

from server.core.views import customviewsets


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]


class CreateCompanyViewSet(customviewsets.CreateUpdateDeleteViewSet):
    queryset = Company.objects.all()
    serializer_class = CreateCompanySerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
