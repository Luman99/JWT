from rest_framework.serializers import ModelSerializer
from base.models import Note
from django.contrib.auth import get_user_model

User = get_user_model()

class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
