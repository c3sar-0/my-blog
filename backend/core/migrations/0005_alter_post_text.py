# Generated by Django 4.1.5 on 2023-02-09 11:02

from django.db import migrations
import django_editorjs.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_post_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='text',
            field=django_editorjs.fields.EditorJsField(),
        ),
    ]
