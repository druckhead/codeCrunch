# Generated by Django 4.1.7 on 2023-03-28 10:58

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0007_alter_postsolution_thumbs_down_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="job",
            old_name="company",
            new_name="companies",
        ),
        migrations.RenameField(
            model_name="post",
            old_name="user",
            new_name="users",
        ),
        migrations.RenameField(
            model_name="postsolution",
            old_name="user",
            new_name="users",
        ),
    ]
