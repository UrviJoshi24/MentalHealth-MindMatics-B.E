# from django.shortcuts import render
from rest_framework import generics
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
import logging


logger = logging.getLogger(__name__)


# View for user registration
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()  # Query all users
    serializer_class = UserSerializer  # Use UserSerializer for validation and creation
    permission_classes = [AllowAny]  # Allow all users (no authentication needed)

class UserDetailView(APIView):
    # Require the user to be authenticated
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        # Serialize the authenticated user’s data and return it
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
# import json
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .models import PDFReport
# import pywhatkit
# import time
# import datetime

# def send_whatsapp_alert(user_email, depression_score, anxiety_score, stress_score):
#     """
#     Send WhatsApp alert to guardian when scores exceed thresholds
#     """
#     try:
#         # Guardian's phone number - retrieve from settings or environment variables
#         # Make sure to include country code (e.g., "+1234567890")
#         guardian_phone = "+919833973674"
        
#         # Create alert message
#         message = (
#             f"ALERT: User {user_email} has completed a mental health assessment "
#             f"with concerning scores:\n"
#             f"- Depression: {depression_score:.1f}\n"
#             f"- Anxiety: {anxiety_score:.1f}\n"
#             f"- Stress: {stress_score:.1f}\n\n"
#             f"Please check on this person's well-being."
#         )
        
#         # Get current time for scheduling
#         now = datetime.datetime.now()
        
#         # Add 1 minute to current time to allow WhatsApp Web to load
#         send_time = now + datetime.timedelta(minutes=1)
        
#         # Send WhatsApp message
#         pywhatkit.sendwhatmsg(
#             guardian_phone,
#             message,
#             send_time.hour,
#             send_time.minute,
#             wait_time=15,  # Wait 30 seconds for WhatsApp Web to load
#             tab_close=True,
#             close_time=3,
#             press_send=True     # Automatically press the send button
#         )
        
#         return True, "Alert sent successfully"
    
#     except Exception as e:
#         return False, str(e)
    
# # Alternative method that uses PyAutoGUI if pywhatkit still has issues
# def send_whatsapp_alert_alternative(user_email, depression_score, anxiety_score, stress_score):
#     """
#     Alternative approach using PyAutoGUI to ensure message sending
#     Requires: pip install pyautogui
#     """
#     try:
#         import pyautogui
#         import webbrowser
#         from urllib.parse import quote
        
#         # Guardian's phone number
#         guardian_phone = "+919833973674"
#         # Remove any '+' from the number as the URL doesn't use it
#         if guardian_phone.startswith('+'):
#             guardian_phone = guardian_phone[1:]
            
#         # Create alert message
#         message = (
#             f"ALERT: User {user_email} has completed a mental health assessment "
#             f"with concerning scores:\n"
#             f"- Depression: {depression_score:.1f}\n"
#             f"- Anxiety: {anxiety_score:.1f}\n"
#             f"- Stress: {stress_score:.1f}\n\n"
#             f"Please check on this person's well-being."
#         )
        
#         # Encode the message for URL
#         encoded_message = quote(message)
        
#         # Open WhatsApp Web with the pre-filled message
#         webbrowser.open(f'https://web.whatsapp.com/send?phone={guardian_phone}&text={encoded_message}')
        
#         # Wait for WhatsApp Web to load (adjust time as needed)
#         time.sleep(15)
        
#         # Press Enter to send the message
#         pyautogui.press('enter')
        
#         # Wait briefly before closing
#         time.sleep(3)
        
#         # Close the tab (Ctrl+W)
#         pyautogui.hotkey('ctrl', 'w')
        
#         logger.info(f"WhatsApp alert sent via alternative method for user {user_email}")
#         return True, "Alert sent successfully via alternative method"
        
#     except Exception as e:
#         logger.error(f"Failed to send WhatsApp alert via alternative method: {str(e)}")
#         return False, f"Alternative method failed: {str(e)}"
    
# @api_view(['POST'])
# def reports_save(request):
#     email = request.data.get('email')
#     report_data_json = request.data.get('reportData')
#     pdf_file = request.FILES.get('pdfFile')
#     print(email)

#     # Validate required fields
#     if not email or not report_data_json or not pdf_file:
#         return Response(
#             {'message': 'Missing email, reportData, or pdfFile.'},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # Parse JSON data
#     try:
#         report_data = json.loads(report_data_json)
#     except json.JSONDecodeError:
#         return Response(
#             {'message': 'Invalid JSON in reportData.'},
#             status=status.HTTP_400_BAD_REQUEST
#         )
#     print(report_data)

#     # Extract scores from report_data
#     overall_scores = report_data.get("overallScores", {})
#     assessment_results = report_data.get("assessmentResults", {})

#     # Final scores
#     final_depression = float(overall_scores.get("depression", 0))
#     final_anxiety = float(overall_scores.get("anxiety", 0))
#     final_stress = float(overall_scores.get("stress", 0))

#     # Questionnaire scores
#     questionnaire_data = assessment_results.get("questionnaire", {})
#     questionnaire_depression = float(questionnaire_data.get("depression", 0))
#     questionnaire_anxiety = float(questionnaire_data.get("anxiety", 0))
#     questionnaire_stress = float(questionnaire_data.get("stress", 0))

#     # Audio scores
#     audio_data = assessment_results.get("audio", {})
#     audio_depression = float(audio_data.get("depression", 0))
#     audio_anxiety = float(audio_data.get("anxiety", 0))
#     audio_stress = float(audio_data.get("stress", 0))

#     # Video scores
#     video_data = assessment_results.get("video", {})
#     video_depression = float(video_data.get("depression", 0))
#     video_anxiety = float(video_data.get("anxiety", 0))
#     video_stress = float(video_data.get("stress", 0))

#     # Create and save the PDFReport record
#     report = PDFReport(
#         email=email,
#         pdf_file=pdf_file,
#         final_depression=final_depression,
#         final_anxiety=final_anxiety,
#         final_stress=final_stress,
#         questionnaire_depression=questionnaire_depression,
#         questionnaire_anxiety=questionnaire_anxiety,
#         questionnaire_stress=questionnaire_stress,
#         audio_depression=audio_depression,
#         audio_anxiety=audio_anxiety,
#         audio_stress=audio_stress,
#         video_depression=video_depression,
#         video_anxiety=video_anxiety,
#         video_stress=video_stress,
#     )
#     report.save()
#     print(report)
#     # Check if any scores exceed the threshold (10) and send alert if needed
#     alert_needed = False
#     alert_threshold = 1.0
    
#     if final_depression > alert_threshold or final_anxiety > alert_threshold or final_stress > alert_threshold:
#         alert_needed = True
    
#     # Send WhatsApp alert if scores exceed threshold
#     alert_message = ""
#     if alert_needed:
#         try:
#             # Try the primary method first
#             success, message = send_whatsapp_alert(
#                 email, 
#                 final_depression, 
#                 final_anxiety, 
#                 final_stress
#             )
            
#             # If primary method fails, try alternative method
#             if not success:
#                 # Uncomment the following line if you want to use the alternative method as fallback
#                 # success, message = send_whatsapp_alert_alternative(email, final_depression, final_anxiety, final_stress)
#                 pass
                
#             alert_message = f" WhatsApp alert status: {message}."
            
#         except Exception as e:
#             alert_message = f" WhatsApp alert failed: {str(e)}"
#             logger.error(f"WhatsApp alert failed with exception: {str(e)}")

#     return Response({
#         "message": f"Report saved successfully.{alert_message}",
#         "pdf_id": report.id
#     }, status=status.HTTP_200_OK)

import json
import logging
import time
import datetime
from urllib.parse import quote
import pywhatkit
import webbrowser
import pyautogui

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import PDFReport

# Configure logger
logger = logging.getLogger(__name__)

def send_whatsapp_alert(user_email, depression_score, anxiety_score, stress_score):
    """
    Send WhatsApp alert to guardian using pywhatkit.
    """
    try:
        # Retrieve guardian's phone number (with country code)
        guardian_phone = "+919833973674"
        
        # Compose a detailed and structured alert message
        message = (
            "⚠️ URGENT MENTAL HEALTH ALERT ⚠️\n\n"
            f"User Email: {user_email}\n\n"
            "The user has recently completed a comprehensive mental health assessment on our platform. "
            "Based on the results, the following levels have been observed:\n\n"
            f"• Depression Level: {depression_score:.1f}\n"
            f"• Anxiety Level: {anxiety_score:.1f}\n"
            f"• Stress Level: {stress_score:.1f}\n\n"
            "These scores indicate a significant level of distress. We strongly recommend that you, as their "
            "guardian, reach out to the user as soon as possible to provide support and ensure their well-being.\n\n"
            "This alert was automatically generated by @Mind Matrics."
        )
        
        # Calculate sending time (add 1 minute to allow WhatsApp Web to load)
        now = datetime.datetime.now()
        send_time = now + datetime.timedelta(minutes=1)
        
        # Send the WhatsApp message using pywhatkit
        pywhatkit.sendwhatmsg(
            guardian_phone,
            message,
            send_time.hour,
            send_time.minute,
            wait_time=15,
            tab_close=True,
            close_time=3
        )
        logger.info(f"WhatsApp alert sent for user {user_email} using pywhatkit.")
        return True, "Alert sent successfully via pywhatkit."
    
    except Exception as e:
        logger.error(f"Failed to send WhatsApp alert using pywhatkit: {str(e)}")
        return False, str(e)

def send_whatsapp_alert_alternative(user_email, depression_score, anxiety_score, stress_score):
    """
    Alternative approach to send WhatsApp alert using PyAutoGUI.
    """
    try:
        # Guardian's phone number (remove '+' for URL)
        guardian_phone = "+919833973674"
        if guardian_phone.startswith('+'):
            guardian_phone = guardian_phone[1:]
            
        # Compose the alert message
        message = (
            f"ALERT: User {user_email} has completed a mental health assessment with concerning scores:\n"
            f"- Depression: {depression_score:.1f}\n"
            f"- Anxiety: {anxiety_score:.1f}\n"
            f"- Stress: {stress_score:.1f}\n\n"
            "Please check on this person's well-being."
        )
        
        # URL-encode the message and open WhatsApp Web with the pre-filled message
        encoded_message = quote(message)
        webbrowser.open(f'https://web.whatsapp.com/send?phone={guardian_phone}&text={encoded_message}')
        logger.info("Opened WhatsApp Web using alternative method.")
        
        # Wait for WhatsApp Web to load properly
        time.sleep(20)
        
        # Send the message by pressing Enter
        pyautogui.press('enter')
        time.sleep(3)
        
        # Close the WhatsApp Web tab
        pyautogui.hotkey('ctrl', 'w')
        logger.info(f"WhatsApp alert sent for user {user_email} using the alternative method.")
        return True, "Alert sent successfully via alternative method."
        
    except Exception as e:
        logger.error(f"Failed to send WhatsApp alert via alternative method: {str(e)}")
        return False, f"Alternative method failed: {str(e)}"

@api_view(['POST'])
def reports_save(request):
    email = request.data.get('email')
    report_data_json = request.data.get('reportData')
    pdf_file = request.FILES.get('pdfFile')
    
    # Validate required fields
    if not email or not report_data_json or not pdf_file:
        return Response(
            {'message': 'Missing email, reportData, or pdfFile.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Parse JSON data safely
    try:
        report_data = json.loads(report_data_json)
    except json.JSONDecodeError:
        return Response(
            {'message': 'Invalid JSON in reportData.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    overall_scores = report_data.get("overallScores", {})
    assessment_results = report_data.get("assessmentResults", {})

    # Final scores
    final_depression = float(overall_scores.get("depression", 0))
    final_anxiety = float(overall_scores.get("anxiety", 0))
    final_stress = float(overall_scores.get("stress", 0))

    # Questionnaire scores
    questionnaire_data = assessment_results.get("questionnaire", {})
    questionnaire_depression = float(questionnaire_data.get("depression", 0))
    questionnaire_anxiety = float(questionnaire_data.get("anxiety", 0))
    questionnaire_stress = float(questionnaire_data.get("stress", 0))

    # Audio scores
    audio_data = assessment_results.get("audio", {})
    audio_depression = float(audio_data.get("depression", 0))
    audio_anxiety = float(audio_data.get("anxiety", 0))
    audio_stress = float(audio_data.get("stress", 0))

    # Video scores
    video_data = assessment_results.get("video", {})
    video_depression = float(video_data.get("depression", 0))
    video_anxiety = float(video_data.get("anxiety", 0))
    video_stress = float(video_data.get("stress", 0))

    # Create and save the PDFReport record
    report = PDFReport(
        email=email,
        pdf_file=pdf_file,
        final_depression=final_depression,
        final_anxiety=final_anxiety,
        final_stress=final_stress,
        questionnaire_depression=questionnaire_depression,
        questionnaire_anxiety=questionnaire_anxiety,
        questionnaire_stress=questionnaire_stress,
        audio_depression=audio_depression,
        audio_anxiety=audio_anxiety,
        audio_stress=audio_stress,
        video_depression=video_depression,
        video_anxiety=video_anxiety,
        video_stress=video_stress,
    )
    report.save()
    logger.info(f"Report saved for user {email} with id {report.id}.")
    
    # Check if any scores exceed the threshold and send alert if needed
    alert_threshold = 1.0
    alert_needed = final_depression > alert_threshold or final_anxiety > alert_threshold or final_stress > alert_threshold
    alert_message = ""
    
    if alert_needed:
        # Try sending the alert using the primary method first
        success, message = send_whatsapp_alert(email, final_depression, final_anxiety, final_stress)
        if not success:
            logger.info("Primary method failed, attempting alternative method.")
            success, message = send_whatsapp_alert_alternative(email, final_depression, final_anxiety, final_stress)
        alert_message = f" WhatsApp alert status: {message}."
    
    return Response({
        "message": f"Report saved successfully.{alert_message}",
        "pdf_id": report.id
    }, status=status.HTTP_200_OK)