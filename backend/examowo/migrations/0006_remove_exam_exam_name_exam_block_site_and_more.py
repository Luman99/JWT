# Generated by Django 4.1.7 on 2023-03-02 17:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('examowo', '0005_rename_answer_text_answer_text_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exam',
            name='exam_name',
        ),
        migrations.AddField(
            model_name='exam',
            name='block_site',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='exam',
            name='description',
            field=models.CharField(blank=True, default='', max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='exam',
            name='end',
            field=models.DateTimeField(default=None),
        ),
        migrations.AddField(
            model_name='exam',
            name='mix_questions',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='exam',
            name='name',
            field=models.CharField(blank=True, default='', max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='exam',
            name='show_results',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='exam',
            name='start',
            field=models.DateTimeField(default=None),
        ),
        migrations.AddField(
            model_name='exam',
            name='time_to_solve',
            field=models.IntegerField(default=30),
        ),
        migrations.CreateModel(
            name='UserExam',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField(blank=True, null=True)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='examowo.exam')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'exam')},
            },
        ),
        migrations.AddField(
            model_name='exam',
            name='users',
            field=models.ManyToManyField(through='examowo.UserExam', to=settings.AUTH_USER_MODEL),
        ),
    ]
