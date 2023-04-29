from django.urls import path
from . import views


from django.urls import path
from . import views

urlpatterns = [
    path('questions/<int:category_id>/', views.question_list),
    path('create_exam/', views.create_exam),
    path('exams/<int:exam_id>/questions/', views.manage_exam_questions),
    path('exams/<int:exam_id>/users/', views.manage_exam_users),
    path('exams/', views.teacher_exams),
    path('exams/<int:id>/', views.exam_detail),
    path('update_exam/<int:id>/', views.update_exam),
]

