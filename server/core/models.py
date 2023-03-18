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
    is_moderator = models.BooleanField(default=False)
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
