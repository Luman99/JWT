# Generated by Django 4.1.7 on 2023-07-24 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userowo', '0003_alter_user_surname'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(blank=True, default='', max_length=50, null=True),
        ),
    ]
