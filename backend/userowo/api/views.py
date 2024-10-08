from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404

from ..models import VerificationToken, StudentsGroup
from .serializers import UserSerializer, UpdateUserSerializer, StudentsGroupSerializer, CreateStudentsGroupSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

User = get_user_model()



def send_verification_email(email, token):
    subject = 'Witamy w serwisie Rowerowo'
    # Treść wiadomości w HTML
    message_html = f"""
    <div style="border: 2px solid #e0e0e0; padding: 10px; margin: 10px; border-radius: 5px;">
        <p>Witamy,</p>
        
        <p>Konto Rowerowo zostało utworzone pomyślnie.<br>

        <a href="http://localhost:3000/verify_registration/{token}/">Aktywuj swoje konto klikając w ten link</a> <br>

        Od momentu aktywacji będziesz mógł się zalogować, podając adres e-mail {email} oraz swoje hasło.</p>

        <p>Szerokiej drogi w nauce.</p>
        <p>Z poważaniem,<br>
        Zespół Rowerowo</p>
    </div>
    """
    
    from_email = 'lukasz.grabowski@zdalna-lekcja.pl'
    recipient_list = [email]
 # Użyj metody send_mail z odpowiednimi parametrami dla wiadomości HTML
    send_mail(subject, '', from_email, recipient_list, html_message=message_html)




@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        verification_token = VerificationToken.objects.create(user=user)
        send_verification_email(user.email, verification_token.token)

        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'email': user.email
        }
        return Response(token, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def verify_token(request, token):
    try:
        verification_token = VerificationToken.objects.get(token=token)
        user = verification_token.user
        return JsonResponse({'email': user.email})
    except VerificationToken.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=400)

@api_view(['PATCH', 'DELETE'])
def update_user(request, email):
    user = User.objects.get(email=email)

    serializer = UpdateUserSerializer(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()

        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'email': user.email
        }

        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def edit_user(request, email):
    user = User.objects.get(email=email)

    if request.method == 'PATCH':
        serializer = UpdateUserSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_students_group(request):
    user = request.user
    studentsgroups = StudentsGroup.objects.filter(teacher=user)
    serialized_data = []
    for group in studentsgroups:
        students = group.user_set.all()
        group_data = StudentsGroupSerializer(group).data
        group_data["students"] = [UserSerializer(student).data for student in students]
        group_data["id"] = group.pk
        serialized_data.append(group_data)
    return JsonResponse(serialized_data, safe=False)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_students_group(request, pk):
    user = request.user
    studentsgroup = get_object_or_404(StudentsGroup, pk=pk, teacher=user)
    
    if request.method == 'PATCH':
        serializer = StudentsGroupSerializer(studentsgroup, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        studentsgroup.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_students_group(request):
    user = request.user
    serializer = CreateStudentsGroupSerializer(data=request.data)
    if serializer.is_valid():
        studentsgroup = serializer.save(teacher=user)
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    # Sprawdzenie poprawności obecnego hasła
    if not check_password(current_password, user.password):
        return Response({'message': 'Invalid current password'}, status=status.HTTP_400_BAD_REQUEST)

    # Sprawdzenie, czy nowe hasło jest różne od obecnego
    if current_password == new_password:
        return Response({'message': 'New password must be different from current password'}, status=status.HTTP_400_BAD_REQUEST)

    # Zmiana hasła
    user.set_password(new_password)
    user.save()

    return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

