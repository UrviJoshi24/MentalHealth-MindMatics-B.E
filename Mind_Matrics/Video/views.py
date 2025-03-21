import os
import subprocess
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
        print("No video file uploaded")
        return JsonResponse({'error': 'No video file uploaded'}, status=400)

    video_file = request.FILES['video']
    file_path = default_storage.save(f"uploads/{video_file.name}", video_file)
    print("Original file path:", file_path)

    # # Check if the file is .webm and convert it to .mp4
    # if file_path.lower().endswith('.webm'):
    #     mp4_path = file_path.rsplit('.', 1)[0] + '.mp4'
    #     try:
    #         # Convert using ffmpeg
    #         subprocess.run(['ffmpeg', '-i', file_path, mp4_path], check=True)
    #         # Optionally delete the original .webm file after conversion
    #         default_storage.delete(file_path)
    #         file_path = mp4_path
    #         print("Converted file to mp4:", file_path)
    #     except subprocess.CalledProcessError as e:
    #         print("Error converting video:", e)
    #         return JsonResponse({'error': 'Error converting video file'}, status=500)

    try:
        # Load model and call Gradio API    
        client = Client("UrviJoshi/Video-based-emotion-detection")
        result = client.predict(
            video={"video": handle_file(file_path)},
            api_name="/predict"
        )
        print("Reached here")
        # Extract only required data (ignore heatmap)
        mental_health_scores = result[0]  # JSON data
        print(mental_health_scores)

        # Delete the uploaded file after processing
        default_storage.delete(file_path)
        return JsonResponse({
            "mental_health_scores": mental_health_scores,
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



# import os
# import cv2
# from deepface import DeepFace
# from django.http import JsonResponse
# from django.core.files.storage import default_storage
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def predict_emotion(request):
#     if 'video' not in request.FILES:
#         return JsonResponse({'error': 'No video file uploaded'}, status=400)

#     video_file = request.FILES['video']
#     file_path = default_storage.save(f"uploads/{video_file.name}", video_file)

#     try:
#         # Open video file with OpenCV
#         cap = cv2.VideoCapture(file_path)
#         if not cap.isOpened():
#             raise Exception("Could not open video file.")

#         # Determine frame rate and target frame index (sample at ~1 second)
#         fps = cap.get(cv2.CAP_PROP_FPS)
#         target_frame = int(fps) if fps and fps > 0 else 0
#         cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)

#         ret, frame = cap.read()
#         if not ret:
#             raise Exception("Could not read a frame from the video.")

#         # Optional: Convert the frame from BGR (OpenCV default) to RGB if needed
#         # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#         # Analyze the frame using DeepFace
#         analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)

#         cap.release()
#         # Remove the uploaded video file after processing
#         default_storage.delete(file_path)

#         return JsonResponse({
#             "dominant_emotion": analysis.get('dominant_emotion'),
#             "emotion_scores": analysis.get('emotion')
#         })

#     except Exception as e:
#         # Clean up file in case of error
#         default_storage.delete(file_path)
#         return JsonResponse({'error': str(e)}, status=500)
