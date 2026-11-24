from django.contrib import admin

# Register your models here.
from .models import Category, MenuItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "sort_order", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)
    ordering = ("sort_order", "name")


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "is_available",
        "is_featured",
    )

    list_filter = ("category", "is_available", "is_featured")
    search_fields = ("name", "description")
    list_editable = ("price", "is_available", "is_featured")
    autocomplete_fields = ("category",)   
