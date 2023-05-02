from django_countries.serializers import CountryFieldMixin
from rest_framework import serializers

from ..models import Company


class CompanySerializer(CountryFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class CreateCompanySerializer(CountryFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"

    def create(self, validated_data):
        company = Company(
            name=validated_data["name"],
        )
        company.save()
        return company
