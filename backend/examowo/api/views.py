from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from ..models import Exam, Category, Question, Answer
from .serializers import QuestionSerializer, AnswerSerializer, ExamSerializer
from userowo.api.serializers import UserSerializer
import random

def generate_access_code(teacher):
    access_code = random.randint(1000, 9999)
    while Exam.objects.filter(access_code=access_code, teacher=teacher).exists():
        access_code = random.randint(1000, 9999)
    return access_code

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_exam(request):
    teacher = request.user
    data = request.data.copy()  # Tworzymy kopię danych wejściowych, aby móc je zmodyfikować
    access_code = generate_access_code(teacher)  # Generujemy kod dostępu
    data['access_code'] = access_code  # Dodajemy kod dostępu do danych wejściowych

    serializer = ExamSerializer(data=data)
    if serializer.is_valid():
        exam = serializer.save()
        return Response({'id': exam.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def add_questions_to_exam(request, exam_id):
    exam = get_object_or_404(Exam, id=exam_id)
    question_ids = request.data.get('questions', [])
    question_objs = [Question.objects.get(id=q) for q in question_ids]
    exam.questions.add(*question_objs)
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_exam(request, id):
    try:
        exam = Exam.objects.get(id=id)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ExamSerializer(exam, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






# @api_view(['PATCH'])
# @permission_classes([IsAuthenticated])
# def add_questions_to_exam(request, exam_id):
#     exam = get_object_or_404(Exam, id=exam_id)
#     questions = request.data.get('questions', [])
#     question_objs = []
#     for question_id in questions:
#         question_obj = get_object_or_404(Question, id=question_id)
#         question_obj.exam = exam
#         question_objs.append(question_obj)
#     Question.objects.bulk_update(question_objs, ['exam'])
#     return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def manage_exam_users(request, exam_id):
    exam = get_object_or_404(Exam, id=exam_id)

    if request.method == 'GET':
        users = exam.users.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        users = request.data.get('users', [])
        exam.users.set(users)
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_exams(request):
    exams = Exam.objects.filter(teacher=request.query_params.get('teacher'))
    exams_data = [{'id': exam.id, 'name': exam.name} for exam in exams]
    return JsonResponse(exams_data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exam_detail(request, id):
    try:
        exam = Exam.objects.get(id=id)
        exam_data = {
            'id': exam.id,
            'name': exam.name,
            'description': exam.description,
            'start': exam.start,
            'end': exam.end,
            'time_to_solve': exam.time_to_solve,
            'show_results': exam.show_results,
            'block_site': exam.block_site,
            'mix_questions': exam.mix_questions
        }
        return JsonResponse(exam_data, safe=False)
    except Exam.DoesNotExist:
        return JsonResponse({'error': 'Exam not found'}, status=404)

