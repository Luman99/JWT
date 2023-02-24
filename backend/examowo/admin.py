from django.contrib import admin
from examowo.models import Exam, Category, Question, Answer

# Register your models here.

admin.site.register(Exam)
admin.site.register(Category)
admin.site.register(Question)
admin.site.register(Answer)
