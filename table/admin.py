from django.contrib import admin
from .models import DinningTable

# Register your models here.

@admin.register(DinningTable)
class DinningTableAdmin(admin.ModelAdmin):
    list_display = ("table_number", "capacity", "section", "status", "is_active")
    list_filter = ("status", "is_active", "section")
    search_fields = ("table_number", "section")
    list_editable = ("status", "is_active")
