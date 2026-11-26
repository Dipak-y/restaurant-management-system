from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class StaffProfile(models.Model):

    ROLE_CHOICES = [
        ("MANAGER", "Manager"),
        ("WAITER", "Waiter"),
        ("KITCHEN", "kitchen"),
    ]


    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="staff_profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.username} - {self.role}"
       
