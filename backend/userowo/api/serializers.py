from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UpdateUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active']
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
            'password': {'required': False},
        }
