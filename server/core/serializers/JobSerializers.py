from rest_framework import serializers

from .CompanySerializers import CompanySerializer

from ..models import Job


class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = Job
        fields = "__all__"


class CreateJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["title", "seniority"]

    def create(self, validated_data):
        job = Job(
            title=validated_data["title"],
            seniority=validated_data["seniority"],
        )
        job.save()
        return job
