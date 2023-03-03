from rest_framework import serializers
from examowo.models import Question, Answer, Exam


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'correct']


class QuestionSerializer(serializers.ModelSerializer):
    answer_set = AnswerSerializer(source='answer_set.all', many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answer_set']


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'
