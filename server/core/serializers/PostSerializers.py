from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from .JobSerializers import JobSerializer

from .UserSerializers import UserSerializer
from ..models import Post, PostSolution, User


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["title", "description", "post_type", "job", "user"]

    def create(self, validated_data):
        post = Post(
            title=validated_data["title"],
            description=validated_data["description"],
            post_type=validated_data["post_type"],
            job=validated_data["job"],
            user=validated_data["user"],
        )
        post.save()
        return post


class UpdatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["title", "description", "post_type", "job"]

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
        fields = ["solution", "post", "user"]

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
        fields = ["solution"]

    def update(self, instance, validated_data):
        instance.solution = validated_data.get("solution", instance.solution)

        instance.save()
        return instance
