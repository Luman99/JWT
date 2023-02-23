from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from .models import StudentsGroup

# Register your models here.


User = get_user_model()

# Remove Group Model from admin. We're not using it.
admin.site.unregister(Group)
admin.site.register(User)
admin.site.register(StudentsGroup)
