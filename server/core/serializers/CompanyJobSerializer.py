from rest_framework import serializers

from .JobSerializers import JobSerializer

from .CompanySerializers import CompanySerializer

from ..models import CompanyJob


class CompanyJobSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    job = JobSerializer()

    class Meta:
        model = CompanyJob
        fields = "__all__"
