from django.db import transaction
from django_countries import serializer_fields
from rest_framework import serializers

from .CompanyJobSerializer import CompanyJobSerializer

from .UserSerializers import UserSerializer

from ..models import Company, CompanyJob, Job, Post, PostSolution


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    company_job = CompanyJobSerializer()

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["user"]


class CreatePostSerializer(serializers.ModelSerializer):
    company = serializers.CharField(max_length=128, write_only=True)
    job = serializers.CharField(max_length=128, write_only=True)
    country = serializer_fields.CountryField(write_only=True)

    class Meta:
        model = Post
        fields = "__all__"
        extra_kwargs = {
            "company_job": {
                "read_only": True,
            },
        }

    def create(self, validated_data):
        with transaction.atomic():
            job, job_created = Job.objects.get_or_create(
                title=validated_data.pop("job")
            )

            company, created_company = Company.objects.get_or_create(
                name=validated_data.pop("company")
            )

            job.companies.add(company)

            companyjob = CompanyJob.objects.select_for_update().get(
                job_id=job, company_id=company
            )
            companyjob.country = validated_data.pop("country")
            companyjob.save()

            post = Post.objects.create(company_job=companyjob, **validated_data)

            return post


class UpdatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"
        write_only_fields = ["user"]

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.post_type = validated_data.get("post_type", instance.post_type)
        instance.job = validated_data.get("job", instance.job)
        instance.save()

        return instance


class PostSolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSolution
        fields = "__all__"


class CreatePostSolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSolution
        fields = "__all__"

    def create(self, validated_data):
        post_solution = PostSolution(
            solution=validated_data["solution"],
            post=validated_data["post"],
            user=validated_data["user"],
        )
        post_solution.save()
        return post_solution


class UpdatePostSolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSolution
        fields = "__all__"
        read_only_fields = ["user", "post"]

    def update(self, instance, validated_data):
        instance.solution = validated_data.get("solution", instance.solution)

        instance.save()
        return instance
