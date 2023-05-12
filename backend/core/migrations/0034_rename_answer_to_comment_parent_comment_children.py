# Generated by Django 4.1.5 on 2023-05-10 02:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0033_alter_comment_depth'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='answer_to',
            new_name='parent',
        ),
        migrations.AddField(
            model_name='comment',
            name='children',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.comment'),
        ),
    ]
