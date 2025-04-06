"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from userauth.views import *
from Audio.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from Questionnaire.views import save_results ,combined_results
from Audio.views import report_generate



urlpatterns = [
    path('admin/', admin.site.urls),
    path('diary/', include('Diary.urls')),  # Ensure this line is present
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('api-auth/', include("rest_framework.urls")),
    path('api/user/details/', UserDetailView.as_view(), name="user_details"),
    path('api/audio/input/', process_audio_files_and_transcripts, name='process_audio_files'),
    path('api/save-results/', save_results, name='save_results'),
    path('video/', include("Video.urls")),
    path('api/fetch_data/', combined_results, name='save_results'),
    path('api/report_generate/',report_generate, name='report_generate'),
    path('api/reports-save/',reports_save,name="reports_save"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)