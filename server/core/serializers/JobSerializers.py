from rest_framework import serializers
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404

from .CompanySerializers import CompanySerializer

from ..models import Company, Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"


class CreateJobSerializer(serializers.ModelSerializer):
    company_id = serializers.CharField(max_length=128, write_only=True)

    class Meta:
        model = Job
        fields = ["title", "seniority", "company_id"]

    def create(self, validated_data):
        job = Job(
            title=validated_data["title"],
            seniority=validated_data["seniority"],
        )
        job.save()
        job.companies.add(validated_data["company_id"])
        return job

    def save(self, **kwargs):
        return super().save(**kwargs)


class UpdateJobSerializer(serializers.ModelSerializer):
    company_ids = serializers.ListField(write_only=True)

    class Meta:
        model = Job
        fields = ["title", "seniority", "company_ids"]

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.seniority = validated_data.get("seniority", instance.seniority)
        instance.save()

        if "company_ids" in validated_data:
            companies = []
            company_ids = validated_data.pop("company_ids")
            for company_id in company_ids:
                try:
                    company = Company.objects.get(id=company_id)
                    companies.append(company)
                except:
                    raise NotFound()
            instance.companies.set(companies)

        return instance
