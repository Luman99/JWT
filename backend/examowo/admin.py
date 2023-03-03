from django.contrib import admin
from examowo.models import Exam, Category, Question, Answer, ExamQuestion

# Register your models here.

class ExamQuestionInline(admin.TabularInline):
    model = Exam.questions.through

class QuestionExamInline(admin.TabularInline):
    model = ExamQuestion
    extra = 0

class AnswerInline(admin.TabularInline):
    model = Answer

class QuestionInline(admin.TabularInline):
    model = Question

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'start', 'end', 'time_to_solve', 'show_results', 'block_site', 'mix_questions')

    inlines = [
        ExamQuestionInline,
        QuestionExamInline,
    ]

class CategoryAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline, QuestionExamInline]

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    pass

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass
