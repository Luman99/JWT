from django.urls import path
from . import views


urlpatterns = [
    path('users/', views.create_user),
    path('users/<str:email>/', views.update_user),
    path('edit_user/<str:email>/', views.edit_user),
    path('verify-token/<str:token>/', views.verify_token, name='verify_token'),
    path('students_group/', views.get_students_group),
    path('students_group/<int:pk>/', views.update_students_group),
    path('create_students_group/', views.create_students_group),
    path('change_password/', views.change_password),
    # path('password-reset/', views.password_reset_request, name='password-reset'),

]
