from rest_framework import serializers
from .models import QuestionnaireResult
from Audio.models import AudioResult
from Video.models import VideoResult
from userauth.models import PDFReport

class QuestionnaireResultSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='time_stamp', format='%Y-%m-%d %H:%M')

    class Meta:
        model = QuestionnaireResult
        fields = ['timestamp', 'depression', 'anxiety', 'stress']

class AudioResultSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='time_stamp', format='%Y-%m-%d %H:%M')

    class Meta:
        model = AudioResult
        fields = ['timestamp', 'depression', 'anxiety', 'stress']

class VideoResultSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='time_stamp', format='%Y-%m-%d %H:%M')

    class Meta:
        model = VideoResult
        fields = ['timestamp', 'depression', 'anxiety', 'stress']

class OverAllResultSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='time_stamp', format='%Y-%m-%d %H:%M')

    class Meta:
        model = PDFReport
        fields = ['timestamp','id','pdf_file', 'final_depression', 'final_anxiety', 'final_stress','questionnaire_depression'
                  ,'questionnaire_anxiety','questionnaire_stress','audio_depression','audio_anxiety','audio_stress'
                  ,'video_depression','video_anxiety','video_stress']