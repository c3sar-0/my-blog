# Generated by Django 4.1.5 on 2023-02-16 17:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_bookmark'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmark',
            name='post',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.post'),
        ),
        migrations.AlterField(
            model_name='bookmark',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookmarks', to=settings.AUTH_USER_MODEL),
        ),
    ]