# Generated by Django 4.1.7 on 2023-03-03 10:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('examowo', '0010_rename_exam_name_exam_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='exam',
            old_name='name',
            new_name='exam_name',
        ),
    ]
