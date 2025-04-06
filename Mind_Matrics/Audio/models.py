from django.db import models
from userauth.models import User  

class AudioResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time_stamp = models.DateTimeField()
    email = models.EmailField()
    depression = models.FloatField()
    anxiety = models.FloatField() 
    stress = models.FloatField()  

    class Meta:
        unique_together = ('user', 'time_stamp')
        db_table = 'audio_result'

    def __str__(self):
        return f"Result for {self.user.email} at {self.time_stamp}"