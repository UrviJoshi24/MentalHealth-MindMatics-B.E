# import json
# import os
# import subprocess
# from django.http import JsonResponse
# from django.conf import settings
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from gradio_client import Client, handle_file
# from django.core.files.storage import default_storage

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def predict_emotion(request):
#     if 'video' not in request.FILES:
#         print("No video file uploaded")
#         return JsonResponse({'error': 'No video file uploaded'}, status=400)
    
#     # Retrieve and parse JSON responses from FormData
#     responses_json = request.POST.get("responses")  # Get as a string
#     try:
#         responses = json.loads(responses_json)  # Convert to Python list
#     except json.JSONDecodeError:
#         return JsonResponse({'error': 'Invalid JSON format'}, status=400)

#     video_file = request.FILES['video']
#     file_path = default_storage.save(f"uploads/{video_file.name}", video_file)
#     print("Original file path:", file_path)
    

#     # # Check if the file is .webm and convert it to .mp4
#     # if file_path.lower().endswith('.webm'):
#     #     mp4_path = file_path.rsplit('.', 1)[0] + '.mp4'
#     #     try:
#     #         # Convert using ffmpeg
#     #         subprocess.run(['ffmpeg', '-i', file_path, mp4_path], check=True)
#     #         # Optionally delete the original .webm file after conversion
#     #         default_storage.delete(file_path)
#     #         file_path = mp4_path
#     #         print("Converted file to mp4:", file_path)
#     #     except subprocess.CalledProcessError as e:
#     #         print("Error converting video:", e)
#     #         return JsonResponse({'error': 'Error converting video file'}, status=500)

#     try:
#         # Load model and call Gradio API    
#         client = Client("UrviJoshi/Video-based-emotion-detection")
#         result = client.predict(
#             video={"video": handle_file(file_path)},
#             api_name="/predict"
#         )
#         # Extract only required data (ignore heatmap)
#         mental_health_scores = result[2]  # JSON data

#         # Delete the uploaded file after processing
#         default_storage.delete(file_path)
#         return JsonResponse({
#             "mental_health_scores": mental_health_scores,
#         })
    
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)



# # import os
# # import cv2
# # from deepface import DeepFace
# # from django.http import JsonResponse
# # from django.core.files.storage import default_storage
# # from rest_framework.decorators import api_view, permission_classes
# # from rest_framework.permissions import IsAuthenticated

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def predict_emotion(request):
# #     if 'video' not in request.FILES:
# #         return JsonResponse({'error': 'No video file uploaded'}, status=400)

# #     video_file = request.FILES['video']
# #     file_path = default_storage.save(f"uploads/{video_file.name}", video_file)

# #     try:
# #         # Open video file with OpenCV
# #         cap = cv2.VideoCapture(file_path)
# #         if not cap.isOpened():
# #             raise Exception("Could not open video file.")

# #         # Determine frame rate and target frame index (sample at ~1 second)
# #         fps = cap.get(cv2.CAP_PROP_FPS)
# #         target_frame = int(fps) if fps and fps > 0 else 0
# #         cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)

# #         ret, frame = cap.read()
# #         if not ret:
# #             raise Exception("Could not read a frame from the video.")

# #         # Optional: Convert the frame from BGR (OpenCV default) to RGB if needed
# #         # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

# #         # Analyze the frame using DeepFace
# #         analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)

# #         cap.release()
# #         # Remove the uploaded video file after processing
# #         default_storage.delete(file_path)

# #         return JsonResponse({
# #             "dominant_emotion": analysis.get('dominant_emotion'),
# #             "emotion_scores": analysis.get('emotion')
# #         })

# #     except Exception as e:
# #         # Clean up file in case of error
# #         default_storage.delete(file_path)
# #         return JsonResponse({'error': str(e)}, status=500)

import json
import os
from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from gradio_client import Client, handle_file
from .models import VideoResult
from userauth.models import User
# Initialize Hugging Face clients
VIDEO_ANALYSIS_SPACE = "UrviJoshi/Video-based-emotion-detection"
TEXT_ANALYSIS_SPACE = "Karanjain09/Text_Analysis"
video_client = Client(VIDEO_ANALYSIS_SPACE)
text_client = Client(TEXT_ANALYSIS_SPACE)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_emotion(request):
    # Initialize variables
    video_prediction = {}
    text_predictions = []
    transcript_data = {}
    
    # 1. Process video if provided
    if 'video' in request.FILES:
        video_file = request.FILES['video']
        file_path = default_storage.save(f"uploads/{video_file.name}", video_file)
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        print("Video file saved at:", file_path)
        print("Full path:", full_path)
        
        try:
            # Process video with Gradio API
            result = video_client.predict(
                video={"video": handle_file(full_path)},
                api_name="/predict"
            )
            # Extract mental health scores from video analysis
            print(result)
            video_prediction = result[2]  # JSON data with mental health scores
            
            # Delete the uploaded file after processing
            default_storage.delete(file_path)
            
        except Exception as e:
            return JsonResponse({'error': f"Video analysis failed: {str(e)}"}, status=500)
    else:
        print("No video file uploaded")
        
    # 2. Retrieve and parse the "responses" JSON from FormData
    try:
        responses_json = request.POST.get("responses")  # Get as a string
        if responses_json:
            responses = json.loads(responses_json)  # Convert to Python dict/list
            print("Successfully parsed responses JSON:", responses)
            
            # Convert the responses to transcript data
            # Depending on the structure, it might be a dict with numeric keys
            if isinstance(responses, dict):
                for key, value in responses.items():
                    transcript_data[f'transcript_{key}'] = value
            # Or it might be a list
            elif isinstance(responses, list):
                for i, text in enumerate(responses):
                    transcript_data[f'transcript_{i+1}'] = text
            
            print("Extracted transcript data:", transcript_data)
        else:
            print("No 'responses' field found in request.POST")
    except json.JSONDecodeError as e:
        print(f"Error parsing responses JSON: {str(e)}")
        return JsonResponse({'error': 'Invalid JSON format in responses'}, status=400)
    except Exception as e:
        print(f"Unexpected error handling responses: {str(e)}")
    
    # Process each transcript
    num_transcripts = 6
    for i in range(0, num_transcripts):
        transcript_key = f'transcript_{i}'
        alt_key = f'transcript_{i-1}'  # Also try 0-based index
        text_prediction = {}
        
        # Try different keys to find the transcript
        transcript_text = None
        if transcript_key in transcript_data:
            transcript_text = transcript_data[transcript_key]
        elif alt_key in transcript_data:
            transcript_text = transcript_data[alt_key]
        elif str(i) in transcript_data:
            transcript_text = transcript_data[str(i)]
        elif str(i-1) in transcript_data:
            transcript_text = transcript_data[str(i-1)]
        
        # If transcript found, process it
        if transcript_text:
            try:
                print(f"Processing transcript {i}: {transcript_text[:50]}...")  # Print first 50 chars
                text_result = text_client.predict(
                    diary_text=transcript_text,
                    api_name="/predict"
                )
                text_prediction = {
                    "text_emotion_percentages": text_result[0],
                    "text_mental_health_scores": text_result[1]
                }
            except Exception as e:
                text_prediction = {"error": f"Text processing failed: {str(e)}"}
        else:
            text_prediction = {"error": "No transcript provided"}
            
        text_predictions.append({
            "text_index": i,
            "text_prediction": text_prediction,
            "transcript": transcript_text  # Include the transcript for debugging
        })
    
    # Retrieve the email from the request data
    email = request.POST.get('email')
    if not email:
        return JsonResponse({"message": "Email is required."}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"message": "User not found."}, status=404)
    
    # 4. Calculate final mental health scores by combining video and text results
    # Initialize counters for text scores
    total_depression_text = 0.0
    total_anxiety_text = 0.0
    total_stress_text = 0.0
    valid_text_count = 0
    
    # Sum up text scores
    for pred in text_predictions:
        text_scores = pred.get("text_prediction", {}).get("text_mental_health_scores", {})
        
        depression_text = text_scores.get("depression")
        anxiety_text = text_scores.get("anxiety")
        stress_text = text_scores.get("stress")
        
        if depression_text is not None:
            total_depression_text += float(depression_text)
            valid_text_count += 1
        if anxiety_text is not None:
            total_anxiety_text += float(anxiety_text)
        if stress_text is not None:
            total_stress_text += float(stress_text)
    
    depression_video = float(video_prediction.get("depression", 0.0))
    anxiety_video = float(video_prediction.get("anxiety", 0.0)) 
    stress_video = float(video_prediction.get("stress", 0.0))

    # depression_video = depression_video_s * 100
    # anxiety_video = anxiety_video_s * 100
    # stress_video = stress_video_s * 100

    
    # Average text scores
    avg_depression_text = total_depression_text / valid_text_count if valid_text_count > 0 else 0.0
    avg_anxiety_text = total_anxiety_text / valid_text_count if valid_text_count > 0 else 0.0
    avg_stress_text = total_stress_text / valid_text_count if valid_text_count > 0 else 0.0
    
    # Combine video and text scores (equal weight)
    has_video = 'video' in request.FILES
    has_text = valid_text_count > 0
    
    if has_video and has_text:
        # If both video and text are available, average their scores
        final_depression = (depression_video + avg_depression_text) / 2
        final_anxiety = (anxiety_video + avg_anxiety_text) / 2
        final_stress = (stress_video + avg_stress_text) / 2
    elif has_video:
        # If only video is available
        final_depression = depression_video
        final_anxiety = anxiety_video
        final_stress = stress_video
    elif has_text:
        # If only text is available
        final_depression = avg_depression_text
        final_anxiety = avg_anxiety_text
        final_stress = avg_stress_text
    else:
        # No valid data
        final_depression = 0.0
        final_anxiety = 0.0
        final_stress = 0.0
    
    # Save the computed results in the database
    VideoResult.objects.create(
        user=user,
        time_stamp=timezone.now(),
        email=email,
        depression=final_depression,
        anxiety=final_anxiety,
        stress=final_stress
    )
    
    # 6. Prepare and return response
    response_data = {
    "video_prediction": video_prediction if has_video else {"error": "No video provided"},
    "text_predictions": [
        {
            "text_index": item["text_index"],
            "text_prediction": item["text_prediction"]["text_mental_health_scores"],
            "transcript": item["transcript"]
        } for item in text_predictions
    ],
    "final_scores": {
        "depression": final_depression,
        "anxiety": final_anxiety,
        "stress": final_stress
    },
    "message": "Results processed and saved successfully."
}

    
    print(response_data)
    return JsonResponse(response_data, status=200)