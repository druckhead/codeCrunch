from rest_framework import serializers

from .UserSerializers import UserSerializer
from ..models import Post, PostSolution


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Post
        fields = "__all__"


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["title", "description", "post_type"]

    def create(self, validated_data):
        post = Post(
            title=validated_data["title"],
            description=validated_data["description"],
            post_type=validated_data["post_type"],
        )
        post.save()
        return post


class PostSolutionSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    post = PostSerializer()

    class Meta:
        model = PostSolution
        fields = "__all__"


class CreatePostSolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSolution
        fields = ["solution", "post_id"]

    def create(self, validated_data):
        post_solution = PostSolution(
            solution=validated_data["solution"],
            post_id=validated_data["post_id"],
        )
        post_solution.save()
        return post_solution
