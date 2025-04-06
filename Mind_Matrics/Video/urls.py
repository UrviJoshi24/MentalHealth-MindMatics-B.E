
from django.urls import path
from .views import predict_emotion

urlpatterns = [
    path('predict_emotion/', predict_emotion, name='predict-emotion'),
]