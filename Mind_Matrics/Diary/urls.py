from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiaryEntryViewSet, DiaryFolderViewSet, FolderEntriesView, FetchDASView, CalculateCumulativeDASView

# Create the API router
router = DefaultRouter()
router.register(r'entries', DiaryEntryViewSet, basename='diaryentry')
router.register(r'folders', DiaryFolderViewSet, basename='diaryfolder')


urlpatterns = [
    path('', include(router.urls)),  # This registers API routes correctly
    path('folders/<int:folder_id>/entries/', FolderEntriesView.as_view(), name='folder-entries'),
    path('entries/<int:entry_id>/fetch-das/', FetchDASView.as_view(), name='fetch_das_scores'),
    path("folders/<int:folder_id>/calculate-cumulative/", CalculateCumulativeDASView.as_view(), name="calculate_cumulative_das"),


]