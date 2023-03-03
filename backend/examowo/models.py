from django.db import models
from userowo.models import User


class Exam(models.Model):
    def __str__(self):
        return self.name

    name = models.CharField(max_length=200, null=True, blank=True, default='')
    description = models.CharField(max_length=300, null=True, blank=True, default='')
    start = models.DateTimeField(auto_now=False, default=None)
    end = models.DateTimeField(auto_now=False, default=None)
    time_to_solve = models.IntegerField(default=30)
    show_results = models.BooleanField(default=True)
    block_site = models.BooleanField(default=True)
    mix_questions = models.BooleanField(default=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='exams_as_teacher')
    users = models.ManyToManyField(User, through="UserExam")
    questions = models.ManyToManyField('Question', through='ExamQuestion', through_fields=('exam', 'question'))

    @classmethod
    def get_default_pk(cls):
        exam, created = cls.objects.get_or_create(name='pierwszy')
        return exam.pk
    
    def get_questions(self):
        return self.questions.all()


class UserExam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    score = models.IntegerField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'exam',)

class ExamQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.ForeignKey('Question', on_delete=models.CASCADE)



#zmienne typu przepisy ogolne po angielsku
class Category(models.Model):
    przepisy_ogolne = 1
    znaki_drogowe = 2
    zasady_pierwszenstwa = 3
    obsluga_roweru = 4
    pierwsza_pomoc = 5

    CATEGORY_CHOICES = (
        (przepisy_ogolne, 'przepisy_ogolne'),
        (znaki_drogowe, 'znaki_drogowe'),
        (zasady_pierwszenstwa, 'zasady_pierwszenstwa'),
        (obsluga_roweru, 'obsluga_roweru'),
        (pierwsza_pomoc, 'pierwsza_pomoc'),
    )

    # def __str__(self):
    #     return self.category_id

    category_id = models.IntegerField(default=1, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.get_category_name()

    def get_category_name(self):
        return dict(self.CATEGORY_CHOICES).get(self.category_id)
    
    @classmethod
    def get_default_pk(cls):
        category, created = cls.objects.get_or_create(category_id=1)
        return category.pk


class Question(models.Model):
    def __str__(self):
        return self.text

    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    text = models.CharField(max_length=200)

    def get_exams(self):
        return self.exam_set.all()

class Answer(models.Model):
    def __str__(self):
        return self.text

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    correct = models.BooleanField(default='False')