from django.urls import path
from . import views


urlpatterns = [
    path('users/', views.create_user),
    path('users/<str:email>/', views.update_user),
    path('verify-token/<str:token>/', views.verify_token, name='verify_token'),
]
