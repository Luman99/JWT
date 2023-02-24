from django.urls import path
from . import views


urlpatterns = [
    path('questions/<int:category_id>/', views.question_list),
]
