from django.contrib import admin
from .models import StaffProfile

# Register your models here.
@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "phone", "is_active", "created_at")
    list_filter = ("role", "is_active")
    search_fields = ("user__username", "user__first_name", "user__last_name", "phone")

