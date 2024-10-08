from django.db import models
import random
import string
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, username, email, is_teacher, surname='', teacher=None, students_group=None, is_active=False, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        if not password:
            raise ValueError('Users must have a password')


        user = self.model(
            email=self.normalize_email(email),
            username=username,
            surname=surname,
            students_group=students_group,
            teacher=teacher,
            is_teacher=is_teacher,
            is_active=is_active
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, username, email, password):
        """
        Creates and saves a staff user with the given email and password.
        """
        user = self.create_user(
            username=username,
            email=email,
            password=password,
            is_teacher=True,
            is_active=True,
        )
        user.staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            username=username,
            email=email,
            password=password,
            is_teacher=True,
            is_active=True,
        )
        user.staff = True
        user.admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):

    email = models.EmailField(
        verbose_name='email adress',
        max_length=255,
        unique=True,
    )
    username = models.CharField(max_length=50, unique=False, null=True, blank=True, default='')
    surname = models.CharField(max_length=50, unique=False, null=True, blank=True, default='')
    teacher = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    students_group = models.ForeignKey('StudentsGroup', on_delete=models.CASCADE, null=True, blank=True)
    is_teacher = models.BooleanField(default=True)
    is_active = models.BooleanField(default=False)
    staff = models.BooleanField(default=False)  # a admin user; non super-user
    admin = models.BooleanField(default=False)  # a superuser

    # notice the absence of a "Password field", that is built in.

    USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['username']  # Email & Password are required by default.

    objects = UserManager()

    def get_username(self):
        # The user is identified by their email address
        return self.username

    def get_teacher(self):
        # The user is identified by their email address
        return self.teacher

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.staff

    @property
    def is_admin(self):
        "Is the user a admin member?"
        return self.admin

class VerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = self.generate_token()
        return super().save(*args, **kwargs)

    def generate_token(self):
        return ''.join(random.choices(string.ascii_letters + string.digits, k=40))


class StudentsGroup(models.Model):
    name = models.CharField(max_length=40, unique=False)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
