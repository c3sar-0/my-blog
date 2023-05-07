# Generated by Django 4.1.5 on 2023-05-07 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0030_notification_seen'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='comment',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='message',
        ),
        migrations.AddField(
            model_name='notification',
            name='author_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='notification',
            name='notification_type',
            field=models.CharField(choices=[('wall_comment', 'Wall comment'), ('wall_comment_like', 'Wall comment like'), ('post_like', 'Post like'), ('post_comment', 'Post comment'), ('post_comment_like', 'Post comment like')], max_length=50, null=True),
        ),
    ]
