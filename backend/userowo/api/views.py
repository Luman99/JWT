from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.http import JsonResponse

from ..models import VerificationToken
from .serializers import UserSerializer, UpdateUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


def send_verification_email(email, token):
    subject = 'Aktywuj swoje konto'
    message = f'Aktywuj swoje konto klikając w link: http://localhost:3000/verify_registration/{token}/'
    from_email = 'lukasz.grabowski@zdalna-lekcja.pl'
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)


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

@api_view(['PATCH'])
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
