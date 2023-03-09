from django.urls import path
from . import views


from django.urls import path
from . import views

urlpatterns = [
    path('questions/<int:category_id>/', views.question_list),
    path('create_exam/', views.create_exam),
    path('exams/<int:exam_id>/add_questions/', views.add_questions_to_exam),
    path('exams/<int:exam_id>/add_users/', views.add_users_to_exam),
    path('exams/', views.teacher_exams),
]

