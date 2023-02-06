from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    body = models.TextField()
    