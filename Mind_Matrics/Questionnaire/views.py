# views.py
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from userauth.models import User
from .models import QuestionnaireResult
from Audio.models import AudioResult
from Video.models import VideoResult
from userauth.models import PDFReport
from Diary.models import DiaryFolder
from .serializers import (
    QuestionnaireResultSerializer,
    AudioResultSerializer,
    VideoResultSerializer,
    OverAllResultSerializer
)


@api_view(['POST'])
def save_results(request):
    # Extract values from the request
    email = request.data.get('email')
    depression_score = request.data.get('depression_score')
    anxiety_score = request.data.get('anxiety_score')
    stress_score = request.data.get('stress_score')

    # Basic validation to ensure email is provided
    if not email:
        return Response({'message': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Find the user by email from the user table
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Create a new record with the current timestamp
    print("Done")
    result = QuestionnaireResult.objects.create(
        user=user,
        time_stamp=timezone.now(),
        email=email,
        depression=depression_score,
        anxiety=anxiety_score,
        stress=stress_score
    )
    print(result)

    return Response({'message': 'Results saved successfully.'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def combined_results(request):
    email = request.data.get('email')
    print(email)
    if not email:
        return Response({'message': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Query each table filtering by the provided email.
        questionnaire_results = QuestionnaireResult.objects.filter(email=email).values(
            'time_stamp', 'depression', 'anxiety', 'stress'
        )
        audio_results = AudioResult.objects.filter(email=email).values(
            'time_stamp', 'depression', 'anxiety', 'stress'
        )
        video_results = VideoResult.objects.filter(email=email).values(
            'time_stamp', 'depression', 'anxiety', 'stress'
        )
        # diary_results = DiaryFolder.objects.filter(email=email).values(
        #     'time_stamp', 'depression', 'anxiety', 'stress'
        # )
        # # Assuming the Report model corresponds to overallPDFs.
        overall_pdfs = PDFReport.objects.filter(email=email).values()
        
    except Exception as e:
        return Response({'message': 'Error fetching data: ' + str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    diaryResults = [
    {'timestamp': '2024-03-05 15:00', 'depression': 30, 'anxiety': 60, 'stress': 80},
    {'timestamp': '2024-02-05 16:00', 'depression': 50, 'anxiety': 10, 'stress': 60},
    {'timestamp': '2024-01-05 10:00', 'depression': 12, 'anxiety': 30, 'stress': 90},
    {'timestamp': '2023-12-05 12:00', 'depression': 25, 'anxiety': 20, 'stress': 10},
    {'timestamp': '2023-11-05 14:00', 'depression': 20, 'anxiety': 15, 'stress': 40},
]

    # overallPDFs = [
    #     {'title': 'Comprehensive Mental Health Report - Q1 2024', 'url': '/pdfs/report1.pdf', 'date': 'March 2024'},
    #     {'title': 'Monthly Progress Summary', 'url': '/pdfs/report2.pdf', 'date': 'February 2024'},
    #     {'title': 'Year End Assessment', 'url': '/pdfs/report3.pdf', 'date': 'December 2023'},
    #     {'title': 'Quarterly Report - Q3 2023', 'url': '/pdfs/report4.pdf', 'date': 'September 2023'},
    #     {'title': 'Initial Assessment Report', 'url': '/pdfs/report5.pdf', 'date': 'July 2023'},
    # ]
    data = {
        'questionnaireResults': QuestionnaireResultSerializer(questionnaire_results, many=True).data,
        'audioResults': AudioResultSerializer(audio_results, many=True).data,
        'videoResults': VideoResultSerializer(video_results, many=True).data,
        'diaryResults': diaryResults,
        'overallPDFs': OverAllResultSerializer(overall_pdfs,many=True).data,
        # 'diaryResults': list(diary_results),
        # 'overallPDFs': list(overall_pdfs),
    }
    print(data)
    
    return Response(data, status=status.HTTP_200_OK)