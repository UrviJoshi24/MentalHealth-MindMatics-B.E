from rest_framework import viewsets, permissions, status
from django.utils.timezone import now
from .models import DiaryEntry, DiaryFolder
from .serializers import DiaryEntrySerializer, DiaryFolderSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.views import View
from django.http import JsonResponse
from gradio_client import Client
from .utils import fetch_das_scores, calculate_cumulative_scores  
from rest_framework.views import APIView  
from django.db.models import Avg
from rest_framework.exceptions import PermissionDenied

client = Client("Karanjain09/Text_Analysis")  # Replace with your Gradio app name

class DiaryEntryViewSet(viewsets.ModelViewSet):
    """API to manage diary entries."""
    serializer_class = DiaryEntrySerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get", "post", "put", "delete", "options"] 

    def perform_create(self, serializer):
        diary_entry = serializer.save()  # Save the new entry
        # self.diary_entry_id = diary_entry.id  # Store the newly created ID

        das_scores = fetch_das_scores(diary_entry_id,diary_entry.content , client)
        print(das_scores)  

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['diary_entry_id'] = self.diary_entry_id  # Return the ID
        return response


    # def create_diary_entry(request):
    #     required_fields = ["content"]
    #     for field in required_fields:
    #         print(field)
    #         if field not in request.data or not request.data[field].strip():
    #             return Response({"error": f"'{field}' is required"}, status=status.HTTP_400_BAD_REQUEST)

    #         serializer = DiaryEntrySerializer(data=request.data)
    #         if serializer.is_valid():
    #             entry = serializer.save()
    #             print(serializer.data)
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)  # ✅ Includes the new ID
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # @api_view(["PUT"])
    # def update_diary_entry(request, entry_id):
    #     try:
    #         entry = DiaryEntry.objects.get(id=entry_id)
    #     except DiaryEntry.DoesNotExist:
    #         return Response({"error": "Diary entry not found"}, status=status.HTTP_404_NOT_FOUND)

    #     serializer = DiaryEntrySerializer(entry, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         print(serializer.data)
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        """Ensure user can access their own diary entries."""
        folder_id = self.kwargs.get("folder_id")
        if folder_id:
            return DiaryEntry.objects.filter(folder_id=folder_id).order_by('-date')
        return DiaryEntry.objects.all().order_by('-date')

    # def perform_create(self, serializer):
    #     folder_id = self.kwargs.get("folder_id")
    #     today = now().date()

    #     # Auto-create a folder for this entry (if needed)
    #     folder_name = f"{today.replace(day=((today.day - 1) // 5) * 5 + 1)} - {today.replace(day=min(today.day + 4, 30))}"
    #     folder, _ = DiaryFolder.objects.get_or_create(name=folder_name)

    #     # Save the diary entry
    #     # entry = serializer.save(folder=folder, date=today)

    #     # print(entry)

    #     fetch_das_scores(entry_id, entry_content)  # ⬅️ Call DAS scoring function


    @action(detail=False, methods=['get'])
    def today_entry(self, request):
        """Get today's diary entry."""
        today = now().date()
        entry = DiaryEntry.objects.filter(date=today).first()
        if entry:
            # print(entry)
            return Response(DiaryEntrySerializer(entry).data)
        return Response({"message": "No entry found for today."}, status=404)


class DiaryFolderViewSet(viewsets.ModelViewSet):
    """API to manage diary folders."""
    serializer_class = DiaryFolderSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """Ensure user can only see folders containing their entries."""
        return DiaryFolder.objects.all().order_by('-created_at')

    #creates new folder
    def perform_create(self, serializer):
        folder = serializer.save()

        # Automatically create 5 empty diary entries linked to this folder
        DiaryEntry.objects.bulk_create([
            DiaryEntry(folder=folder, title=f"Entry {i+1}", content="") for i in range(5)
        ])

class FolderEntriesView(View):
    """Fetch all diary entries for a folder without page reload."""
    def get(self, request, folder_id):
        try:
            entries = DiaryEntry.objects.filter(folder_id=folder_id).values()
            # print(list(entries))
            # fetch_das_scores(entries, entry_content)
            return JsonResponse(list(entries), safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

class FetchDASView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, entry_id):
        try:
            # ✅ Fetch the diary entry
            entry = DiaryEntry.objects.get(id=entry_id)
            
            # ✅ Fetch DAS scores using existing function
            result = fetch_das_scores(entry.id, entry.content,client)

            if not isinstance(result, tuple) or len(result) < 2:
                return Response({"error": "Invalid API response format"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            das_scores = result[1]  # Extract Mental Health Scores ✅

             # ✅ Debug: Print the response type
            print("Type of das_scores:", type(das_scores))
            print("Raw das_scores:", das_scores)
            
            # ✅ Check if `das_scores` is a string and convert it
            if isinstance(das_scores, str):
                import json
                das_scores = json.loads(das_scores)  # Convert JSON string to dictionary ✅

            # ✅ Ensure it's now a dictionary before extracting values
            if not isinstance(das_scores, dict):
                return Response({"error": "Unexpected API response format"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # ✅ Extract scores safely
            depression = float(das_scores.get("depression", 0))
            anxiety = float(das_scores.get("anxiety", 0))
            stress = float(das_scores.get("stress", 0))

            # ✅ Save scores in database
            entry.depression_score = depression
            entry.anxiety_score = anxiety
            entry.stress_score = stress
            entry.save()

            return Response(
                {"message": "DAS Scores fetched and stored", "result": result},
                status=status.HTTP_200_OK,
            )

            # if result:
            #     return Response({"message": "DAS Scores updated", "scores": result}, status=status.HTTP_200_OK)
            # else:
            #     return Response({"error": "Failed to fetch DAS scores"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except DiaryEntry.DoesNotExist:
            return Response({"error": "Diary entry not found"}, status=status.HTTP_404_NOT_FOUND)

class CalculateCumulativeDASView(APIView):
    def post(self, request, folder_id):
        try:
            folder = DiaryFolder.objects.get(id=folder_id)
            entries = DiaryEntry.objects.filter(folder=folder)

            # ✅ Check if all entries have content
            if any(entry.content.strip() == "" for entry in entries):
                return Response({"error": "All diary entries must have content before calculating cumulative scores."},
                                status=status.HTTP_400_BAD_REQUEST)

            # ✅ Calculate cumulative sums
            cumulative_depression = sum(entry.depression_score for entry in entries)
            cumulative_anxiety = sum(entry.anxiety_score for entry in entries)
            cumulative_stress = sum(entry.stress_score for entry in entries)  # ✅ Fixed incorrect assignment

            print(f"Debug: Depression: {cumulative_depression}, Anxiety: {cumulative_anxiety}, Stress: {cumulative_stress}")

            # ✅ Save cumulative scores in the folder
            folder.cumulative_depression_score = round(cumulative_depression, 2)
            folder.cumulative_anxiety_score = round(cumulative_anxiety, 2)
            folder.cumulative_stress_score = round(cumulative_stress, 2)
            folder.save()

            return Response({"message": "Cumulative DAS scores calculated and stored."}, status=status.HTTP_200_OK)

        except DiaryFolder.DoesNotExist:
            return Response({"error": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class DiaryEntryUpdateView(APIView):
    def put(self, request, entry_id):
        try:
            entry = DiaryEntry.objects.get(id=entry_id)
            folder = entry.folder  # Get the folder of the entry
            
            # ✅ Restrict editing if cumulative score exists
            if folder.cumulative_depression is not None:
                raise PermissionDenied("Editing is disabled after cumulative score calculation.")

            # ✅ Allow update if no cumulative score
            data = request.data
            entry.content = data.get("content", entry.content)
            entry.save()
            return Response({"message": "Diary entry updated successfully."}, status=status.HTTP_200_OK)

        except DiaryEntry.DoesNotExist:
            return Response({"error": "Diary entry not found."}, status=status.HTTP_404_NOT_FOUND)

class DiaryFolderListView(APIView):
    def get(self, request):
        folders = DiaryFolder.objects.all()
        serializer_class = DiaryFolderSerializer
        folder_data = [
            {
                "id": folder.id,
                "name": folder.name,
                "cumulative_depression": folder.cumulative_depression,
                "cumulative_anxiety": folder.cumulative_anxiety,
                "cumulative_stress": folder.cumulative_stress
            }
            for folder in folders
        ]
        return Response(folder_data, status=status.HTTP_200_OK)