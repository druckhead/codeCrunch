from rest_framework import serializers

from ..models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class CreateCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["name", "country"]

    def create(self, validated_data):
        company = Company(
            name=validated_data["name"],
            country=validated_data["country"],
        )
        company.save()
        return company
