from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Job
from ..permissions.basepermissions import BaseCUDPermission
from ..permissions.jobpermissions import JobPermissions
from ..serializers import JobSerializers as serializers


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = serializers.JobSerializer
    # permission_classes = [JobPermissions, BaseCUDPermission]
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve", "create"):
            return serializers.JobSerializer
        if self.action in ("update", "partial_update"):
            return serializers.UpdateJobSerializer
