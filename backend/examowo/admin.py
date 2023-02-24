from django.contrib import admin
from examowo.models import Exam, Category, Question, Answer

# Register your models here.

admin.site.register(Exam)

class AnswerInline(admin.TabularInline):
    model = Answer

class QuestionInline(admin.TabularInline):
    model = Question

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    pass

