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
    access_code = serializers.CharField(required=False)
    class Meta:
        model = Exam
        fields = ['id', 'name', 'description', 'start', 'end', 'time_to_solve', 'show_results', 'block_site', 'mix_questions', 'teacher', 'users', 'questions', 'access_code']
