from django.db import models
from django.utils.timezone import now
from userauth.models import User

class DiaryFolder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # 🔹 User is now optional
    name = models.CharField(max_length=100, unique=True)  # Folder name (e.g., "Feb 1 - Feb 5")
    created_at = models.DateTimeField(auto_now_add=True)

    # Cumulative DAS scores for the 5-day period
    cumulative_depression_score = models.FloatField(null=True, blank=True)
    cumulative_anxiety_score = models.FloatField(null=True, blank=True)
    cumulative_stress_score = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.name}"

class DiaryEntry(models.Model):
    folder = models.ForeignKey(DiaryFolder, on_delete=models.CASCADE, related_name="entries")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Link to user
    title = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    date = models.DateField(default=now)  # 🔹 Removed `unique=True` 
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Daily DAS Scores
    depression_score = models.FloatField(null=True, blank=True)
    anxiety_score = models.FloatField(null=True, blank=True)
    stress_score = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        """Override save method to update DAS scores and cumulative scores when 5 entries are completed."""
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - Entry on {self.date}"