from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Job
from ..serializers import JobSerializers as serializers


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = serializers.JobSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return serializers.JobSerializer
        elif self.action in ("update", "partial_update", "create"):
            return serializers.CreateJobSerializer
