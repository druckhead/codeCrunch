from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel, TitleDescriptionModel

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    is_superuser = models.BooleanField(default=False)
    username = models.CharField(
        max_length=150,
        validators=[
            UnicodeUsernameValidator,
        ],
        unique=True,
    )
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=254, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "email",
    ]

    class Meta:
        ordering = ["-date_joined"]
        verbose_name = _("user")
        verbose_name_plural = _("users")


class Company(models.Model):
    name = models.CharField(max_length=128)
    country = models.CharField(max_length=128)

    class Meta:
        ordering = ["name"]
        verbose_name = _("company")
        verbose_name_plural = _("companies")


class Job(models.Model):
    title = models.CharField(max_length=128)
    seniority = models.CharField(max_length=16)
    companies = models.ManyToManyField(Company)

    class Meta:
        ordering = ["title"]
        verbose_name = _("job")
        verbose_name_plural = _("jobs")


class Vote(models.TextChoices):
    LIKE = "LI", _("Like")
    DISLIKE = "DI", _("Dislike")


class Post(TimeStampedModel, TitleDescriptionModel, models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    users = models.ManyToManyField(
        User,
        through="PostVotes",
        related_name="user_post_votes",
    )
    job = models.ForeignKey(Job, on_delete=models.DO_NOTHING)
    post_type = models.CharField(max_length=32)

    class Meta:
        verbose_name = _("post")
        verbose_name_plural = _("posts")


class PostVotes(TimeStampedModel, models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
    vote = models.CharField(max_length=2, choices=Vote.choices)

    class Meta:
        verbose_name = _("post_vote")
        verbose_name_plural = _("post_votes")
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name="unique_post_liking",
            )
        ]


class PostSolution(TimeStampedModel, models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    users = models.ManyToManyField(
        User,
        through="PostSolutionVotes",
        related_name="user_postsolution_votes",
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    solution = models.TextField()

    class Meta:
        verbose_name = _("post_solution")
        verbose_name_plural = _("post_solutions")


class PostSolutionVotes(TimeStampedModel, models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    postsolution = models.ForeignKey(PostSolution, on_delete=models.DO_NOTHING)
    vote = models.CharField(max_length=2, choices=Vote.choices)

    class Meta:
        verbose_name = _("postsolution_vote")
        verbose_name_plural = _("postsolution_votes")
        constraints = [
            models.UniqueConstraint(
                fields=["user", "postsolution"],
                name="unique_postsolution_liking",
            )
        ]
