from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from ..models import Exam, Category, Question, Answer
from .serializers import QuestionSerializer, AnswerSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def question_list(request, category_id):
    questions = Question.objects.filter(category__category_id=category_id)
    serialized_data = []
    for question in questions:
        answers = question.answer_set.all()
        question_data = QuestionSerializer(question).data
        question_data["answer_set"] = list(answers.values())  # zmiana z 'answers' na 'answer_set'
        serialized_data.append(question_data)

    # Zwróć dane jako odpowiedź HTTP w formacie JSON
    return JsonResponse(serialized_data, safe=False)

