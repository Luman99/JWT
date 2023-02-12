from django.urls import path
from . import views


urlpatterns = [
    path('users/', views.create_user),
    path('users/<str:email>/', views.update_user),
    path('verify-token/<str:token>/', views.verify_token, name='verify_token'),
    path('students_group/', views.get_students_group),
    path('students_group/<int:pk>/', views.update_students_group)
]
