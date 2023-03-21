from operator import mod
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel, TitleDescriptionModel

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        max_length=150,
        validators=[
            UnicodeUsernameValidator,
        ],
        unique=True,
    )
    email = models.EmailField(max_length=150, unique=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager
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
    company = models.ManyToManyField(Company)

    class Meta:
        ordering = ["title"]
        verbose_name = _("job")
        verbose_name_plural = _("jobs")


class Question(TimeStampedModel, TitleDescriptionModel, models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    job = models.ForeignKey(Job, on_delete=models.DO_NOTHING)

    class Meta:
        verbose_name = _("question")
        verbose_name_plural = _("questions")


class QuestionSolution(TimeStampedModel, models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    thumbs_up = models.IntegerField()
    thumbs_down = models.IntegerField()
    solution = models.TextField()

    class Meta:
        verbose_name = _("question_solution")
        verbose_name_plural = _("question_solutions")


class Assignment(TimeStampedModel, TitleDescriptionModel, models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    job = models.ForeignKey(Job, on_delete=models.DO_NOTHING)

    class Meta:
        verbose_name = _("assignment")
        verbose_name_plural = _("assignments")


class AssignmentSolution(TimeStampedModel, models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    thumbs_up = models.IntegerField()
    thumbs_down = models.IntegerField()
    solution = models.TextField()

    class Meta:
        verbose_name = _("assignment_solution")
        verbose_name_plural = _("assignment_solutions")
