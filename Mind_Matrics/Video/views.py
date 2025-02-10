import os
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from gradio_client import Client, handle_file
from django.core.files.storage import default_storage

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_emotion(request):
    if 'video' not in request.FILES:
        return JsonResponse({'error': 'No video file uploaded'}, status=400)

    video_file = request.FILES['video']
    file_path = default_storage.save(f"uploads/{video_file.name}", video_file)

    try:
        # Load model and call Gradio API
        client = Client("UrviJoshi/Video-based-emotion-detection")
        result = client.predict(
            video_file={"video": handle_file(file_path)},
            api_name="/predict"
        )

        # Extract only required data (ignore heatmap)
        mental_health_scores = result[1]  # JSON data
        detected_emotions = result[2]  # JSON data

        # Delete the uploaded file after processing
        default_storage.delete(file_path)
        return JsonResponse({
            "mental_health_scores": mental_health_scores,
            "detected_emotions": detected_emotions
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
