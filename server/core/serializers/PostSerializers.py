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
        fields = ["title", "description", "post_type", "job"]

    def create(self, validated_data):
        # TODO add ability to save user_id on create
        post = Post(
            title=validated_data["title"],
            description=validated_data["description"],
            post_type=validated_data["post_type"],
            job=validated_data["job"],
        )
        post.save()
        return post

    def update(self, instance, validated_data):
        # TODO add ability to update m2m relations for users
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
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = PostSolution
        fields = ["solution", "post", "user_id"]

    def create(self, validated_data):
        post_solution = PostSolution(
            solution=validated_data["solution"],
            post=validated_data["post"],
        )
        post_solution.save()
        post_solution.users.add(validated_data["user_id"])
        return post_solution

    # def update(self, instance, validated_data):
    # TODO add ability to update all data including m2m user_ids
    #     instance.solution = validated_data.get("solution", instance.solution)
    #     instance.post_id = validated_data.get("post_id", instance.post_id)
