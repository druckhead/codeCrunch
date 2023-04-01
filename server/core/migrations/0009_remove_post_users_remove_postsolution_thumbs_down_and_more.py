# Generated by Django 4.1.7 on 2023-03-31 12:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0008_rename_company_job_companies_rename_user_post_users_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="post",
            name="users",
        ),
        migrations.RemoveField(
            model_name="postsolution",
            name="thumbs_down",
        ),
        migrations.RemoveField(
            model_name="postsolution",
            name="thumbs_up",
        ),
        migrations.RemoveField(
            model_name="postsolution",
            name="users",
        ),
        migrations.AddField(
            model_name="post",
            name="user",
            field=models.ForeignKey(
                default="",
                on_delete=django.db.models.deletion.DO_NOTHING,
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="postsolution",
            name="user",
            field=models.ForeignKey(
                default="",
                on_delete=django.db.models.deletion.DO_NOTHING,
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name="PostVotes",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True, verbose_name="created"
                    ),
                ),
                (
                    "modified",
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True, verbose_name="modified"
                    ),
                ),
                (
                    "vote",
                    models.CharField(
                        choices=[("LI", "Like"), ("DI", "Dislike")], max_length=2
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING, to="core.post"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "post_vote",
                "verbose_name_plural": "post_votes",
                "unique_together": {("user", "post")},
            },
        ),
        migrations.CreateModel(
            name="PostSolutionVotes",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True, verbose_name="created"
                    ),
                ),
                (
                    "modified",
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True, verbose_name="modified"
                    ),
                ),
                (
                    "vote",
                    models.CharField(
                        choices=[("LI", "Like"), ("DI", "Dislike")], max_length=2
                    ),
                ),
                (
                    "postsolution",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="core.postsolution",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "postsolution_vote",
                "verbose_name_plural": "postsolution_votes",
                "unique_together": {("user", "postsolution")},
            },
        ),
    ]
