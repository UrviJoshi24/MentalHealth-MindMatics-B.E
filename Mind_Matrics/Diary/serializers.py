from rest_framework import serializers
from .models import DiaryEntry, DiaryFolder

class DiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryEntry
        fields = '__all__'  # Includes all fields
        extra_kwargs = {
            'user': {'required': False}  # Optional user field for testing
        }

class DiaryFolderSerializer(serializers.ModelSerializer):
    entries = DiaryEntrySerializer(many=True, read_only=True)  # Nested serialization

    class Meta:
        model = DiaryFolder
        fields = '__all__'  # Includes id, name, created_at, and related entries