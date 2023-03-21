from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from server.core.views import customviewsets
from ..models import Job
from ..serializers.JobSerializers import JobSerializer, CreateJobSerializer


class JobViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]


class CreateJobViewSet(customviewsets.CreateUpdateDeleteViewSet):
    queryset = Job.objects.all()
    serializer_class = CreateJobSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
