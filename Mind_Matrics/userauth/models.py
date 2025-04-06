from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    email = models.EmailField(max_length=255, unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    guardian_number = models.CharField(max_length=15)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'age', 'gender', 'phone_number', 'guardian_number']

    def __str__(self):
        return self.email
    
import os
from django.db import models
from django.utils import timezone
from userauth.models import User  # Adjust import if needed

def pdf_report_upload_path(instance, filename):
    """
    Constructs a filename using the instance's email and the current timestamp.
    The file will be stored in the 'pdf_reports' directory.
    """
    # Get current timestamp (use timezone.now() for timezone-aware datetime)
    now = timezone.now()
    # Format the timestamp (e.g., 20250322_115730)
    timestamp_str = now.strftime("%Y%m%d_%H%M%S")
    # Clean the email string (replace characters not allowed in filenames)
    safe_email = instance.email.replace('@', '_').replace('.', '_')
    # Build new filename
    new_filename = f"{safe_email}_{timestamp_str}.pdf"
    return os.path.join("pdf_reports", new_filename)

class PDFReport(models.Model):
    email = models.EmailField()
    time_stamp = models.DateTimeField(auto_now_add=True)
    # The PDF file will be stored using our custom upload path function.
    pdf_file = models.FileField(upload_to=pdf_report_upload_path)

    # Final overall scores
    final_depression = models.FloatField()
    final_anxiety = models.FloatField()
    final_stress = models.FloatField()

    # Questionnaire scores
    questionnaire_depression = models.FloatField()
    questionnaire_anxiety = models.FloatField()
    questionnaire_stress = models.FloatField()

    # Audio scores
    audio_depression = models.FloatField()
    audio_anxiety = models.FloatField()
    audio_stress = models.FloatField()

    # Video scores
    video_depression = models.FloatField()
    video_anxiety = models.FloatField()
    video_stress = models.FloatField()

    class Meta:
        # email and time_stamp unique combination
        unique_together = ('email', 'time_stamp')
        db_table = 'pdf_report'

    def __str__(self):
        return f"Report for {self.email} at {self.time_stamp}"