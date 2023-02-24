from django.db import models


class Exam(models.Model):
    def __str__(self):
        return self.exam_name

    exam_name = models.CharField(max_length=200)

    @classmethod
    def get_default_pk(cls):
        exam, created = cls.objects.get_or_create(exam_name='pierwszy')
        return exam.pk


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

    @classmethod
    def get_default_pk(cls):
        category, created = cls.objects.get_or_create(category_id=1)
        return category.pk


class Question(models.Model):
    def __str__(self):
        return self.text

    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, null=True, blank=True) #manytomany i daj żeby exam to miał
    text = models.CharField(max_length=200)


class Answer(models.Model):
    def __str__(self):
        return self.text

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    correct = models.BooleanField(default='False')