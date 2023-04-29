from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('base.api.urls')),
    path('api/', include('userowo.api.urls')),
    path('api/', include('examowo.api.urls')),
]
