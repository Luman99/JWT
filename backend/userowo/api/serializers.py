from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from userowo.models import StudentsGroup

User = get_user_model()


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'surname', 'email', 'password', 'students_group', 'teacher', 'is_active', 'is_teacher')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        students_group = validated_data.pop('students_group', None)
        teacher = validated_data.pop('teacher', None)
        user = User.objects.create_user(**validated_data)
        if students_group:
            user.students_group = students_group
        if teacher:
            user.teacher = teacher
        user.save()
        return user


class UpdateUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active', 'username', 'surname', 'email']
        extra_kwargs = {
            'username': {'required': False},
            'surname': {'required': False},
            'email': {'required': False},
            'password': {'required': False},
        }

class StudentsGroupSerializer(ModelSerializer):
    user_set = UserSerializer(many=True, read_only=False)

    class Meta:
        model = StudentsGroup
        fields = ('id', 'name', 'teacher', 'user_set')

class CreateStudentsGroupSerializer(ModelSerializer):
    class Meta:
        model = StudentsGroup
        fields = ('name', 'teacher')
