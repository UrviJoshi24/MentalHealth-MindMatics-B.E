from django.http import JsonResponse
from django.utils import timezone
from rest_framework.decorators import api_view
from gradio_client import Client, handle_file
import os
import tempfile

from userauth.models import User
from .models import AudioResult
from Video.models import VideoResult
from Questionnaire.models import QuestionnaireResult

@api_view(["POST"])
def report_generate(request):
    try:
        # Retrieve the email from the request data
        email = request.data.get('email')
        print(email)
        if not email:
            return JsonResponse({"message": "Email is required."}, status=400)

        # Fetch the latest records based on the timestamp (adjust 'timestamp' to your actual field name)
        questionnaire_result = QuestionnaireResult.objects.filter(email=email).order_by('-time_stamp').first()
        audio_result = AudioResult.objects.filter(email=email).order_by('-time_stamp').first()
        video_result = VideoResult.objects.filter(email=email).order_by('-time_stamp').first()
        
        # If no record exists in any table, default the values to 0
        audio_data = {
            "depression": audio_result.depression if audio_result else 0,
            "anxiety": audio_result.anxiety if audio_result else 0,
            "stress": audio_result.stress if audio_result else 0,
        }
        questionnaire_data = {
            "depression": questionnaire_result.depression if questionnaire_result else 0,
            "anxiety": questionnaire_result.anxiety if questionnaire_result else 0,
            "stress": questionnaire_result.stress if questionnaire_result else 0,
        }
        video_data = {
            "depression": video_result.depression if video_result else 0,
            "anxiety": video_result.anxiety if video_result else 0,
            "stress": video_result.stress if video_result else 0,
        }
        
        # Construct the response data in the desired format
        resultData = {
            "questionnaireResult": questionnaire_data,
            "audioResult": audio_data,
            "videoResult": video_data,
        }
        print(resultData)
        return JsonResponse(resultData, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Initialize Hugging Face clients
MENTAL_HEALTH_SPACE = "Karanjain2003/Mental_health_prediction"
TEXT_ANALYSIS_SPACE = "Karanjain2003/Text_Analysis"

audio_client = Client(MENTAL_HEALTH_SPACE)
text_client = Client(TEXT_ANALYSIS_SPACE)

@api_view(["POST"])
def process_audio_files_and_transcripts(request):

    predictions = []
    num_prompts = 5  # Number of expected audio/transcript pairs

    try:
        # Process each audio file and its corresponding transcript
        for i in range(1, num_prompts + 1):
            audio_key = f"audio_{i}"
            transcript_key = f"transcript_{i}"
            audio_prediction = {}
            text_prediction = {}

            # Process audio using mkstemp to avoid permission issues on Windows
            if audio_key in request.FILES:
                try:
                    audio_file = request.FILES[audio_key]
                    # Create a temporary file and get its file descriptor and path
                    fd, temp_path = tempfile.mkstemp(suffix=".wav")
                    try:
                        with os.fdopen(fd, "wb") as tmp:
                            tmp.write(audio_file.read())
                            tmp.flush()
                        # Now pass the file path to the Hugging Face API
                        audio_result = audio_client.predict(
                            audio=handle_file(temp_path),
                            api_name="/predict"
                        )
                    finally:
                        # Ensure the temporary file is deleted
                        os.remove(temp_path)
                    audio_prediction = {
                        "audio_emotion_percentages": audio_result[0],
                        "audio_mental_health_scores": audio_result[1]
                    }
                except Exception as e:
                    audio_prediction = {"error": f"Audio processing failed: {str(e)}"}

            # Process text transcript as before
            if transcript_key in request.POST:
                transcript_text = request.POST.get(transcript_key)
                try:
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

            predictions.append({
                "audio_index": i,
                "audio_prediction": audio_prediction,
                "text_prediction": text_prediction,
            })

        # Retrieve the email from the request data
        email = request.POST.get('email')
        if not email:
            return JsonResponse({"message": "Email is required."}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"message": "User not found."}, status=404)

        # Calculate final mental health scores by averaging across all prompts
        total_depression = 0.0
        total_anxiety = 0.0
        total_stress = 0.0
        valid_count = 0

        for pred in predictions:
            audio_scores = pred.get("audio_prediction", {}).get("audio_mental_health_scores", {})
            text_scores = pred.get("text_prediction", {}).get("text_mental_health_scores", {})

            depression_audio = audio_scores.get("depression")
            depression_text = text_scores.get("depression")
            anxiety_audio = audio_scores.get("anxiety")
            anxiety_text = text_scores.get("anxiety")
            stress_audio = audio_scores.get("stress")
            stress_text = text_scores.get("stress")

            # Only include prompt if at least one score is available
            if depression_audio is not None or depression_text is not None:
                # Average depression scores from audio and text if both exist; else use available one.
                depression_final = 0.0
                count_dep = 0
                if depression_audio is not None:
                    depression_final += float(depression_audio)
                    count_dep += 1
                if depression_text is not None:
                    depression_final += float(depression_text)
                    count_dep += 1
                depression_final = depression_final / count_dep if count_dep > 0 else 0.0

                anxiety_final = 0.0
                count_anx = 0
                if anxiety_audio is not None:
                    anxiety_final += float(anxiety_audio)
                    count_anx += 1
                if anxiety_text is not None:
                    anxiety_final += float(anxiety_text)
                    count_anx += 1
                anxiety_final = anxiety_final / count_anx if count_anx > 0 else 0.0

                stress_final = 0.0
                count_stress = 0
                if stress_audio is not None:
                    stress_final += float(stress_audio)
                    count_stress += 1
                if stress_text is not None:
                    stress_final += float(stress_text)
                    count_stress += 1
                stress_final = stress_final / count_stress if count_stress > 0 else 0.0

                total_depression += depression_final
                total_anxiety += anxiety_final
                total_stress += stress_final
                valid_count += 1

        final_depression = total_depression / valid_count if valid_count > 0 else 0.0
        final_anxiety = total_anxiety / valid_count if valid_count > 0 else 0.0
        final_stress = total_stress / valid_count if valid_count > 0 else 0.0

        # Save the computed results in the database
        AudioResult.objects.create(
            user=user,
            time_stamp=timezone.now(),
            email=email,
            depression=final_depression,
            anxiety=final_anxiety,
            stress=final_stress
        )

        response_data = {
            "predictions": predictions,
            "final_scores": {
                "depression": final_depression,
                "anxiety": final_anxiety,
                "stress": final_stress
            },
            "message": "Results processed and saved successfully."
        }
        print(response_data)
        return JsonResponse(response_data, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)