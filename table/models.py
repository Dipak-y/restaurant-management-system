from django.db import models

# Create your models here.


import uuid

class DinningTable(models.Model):

    STATUS_CHOICES = [
        ("AVAILABLE", "Available"),
        ("OCCUPIED", "Occupied"),
        ("RESERVED", "Reserved"),
        ("INACTIVE", "Inactive"),
    ]

    table_number = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField(default=4)
    section = models.CharField(max_length=100, blank=True, help_text="Example: Indoor, Outdoor, Floor 1")
    qr_token = models.UUIDField(default=uuid.uuid4, unique=True,editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="AVAILABLE")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["table_number"]

    def __str__(self):
        return f"Table {self.table_number}"

