from django.contrib import admin
from .models import Restaurant, OperatingHours, RestaurantSettings




@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "email", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "phone", "email")
    


@admin.register(OperatingHours)
class OperatingHoursAdmin(admin.ModelAdmin):
    list_display = ("day", "opening_time", "closing_time", "is_closed")
    list_filter = ("is_closed",)
    ordering = ("day",)


@admin.register(RestaurantSettings)
class RestaurantSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "restaurant",
        "currency",
        "tax_rate",
        "service_charge_rate",
        "qr_ordering_enabled",
    )