from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from .CompanySerializers import CompanySerializer

from ..models import Company, Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"


class CreateJobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(max_length=128, write_only=True)

    class Meta:
        model = Job
        fields = ["title", "seniority", "company_name"]

    def create(self, validated_data):
        job = Job(
            title=validated_data["title"],
            seniority=validated_data["seniority"],
        )
        job.save()
        company = get_object_or_404(
            Company.objects.all(), name=validated_data["company_name"]
        )
        job.company.add(company)
        return job

    def save(self, **kwargs):
        return super().save(**kwargs)


class UpdateJobSerializer(serializers.ModelSerializer):
    companies = CompanySerializer(many=True)

    class Meta:
        model = Job
        fields = ["title", "seniority", "companies"]

    def update(self, instance, validated_data):
        company_data = validated_data.pop("company")
        company = instance.company

        instance.title = validated_data.get("title", instance.title)
        instance.seniority = validated_data.get("seniority", instance.seniority)
        instance.save()

        company.name = company_data.get("name", company.name)
        company.country = company_data.get("name", company.name)
        company.save()

        return instance
