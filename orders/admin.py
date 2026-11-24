from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    autocomplete_fields = ["menu_item"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = ("order_number", "table", "customer_name", "status","created_at",)
    list_filter = ("status", "created_at",)
    search_fields = ( "customer_name","customer_phone", "order_number", "table__table_number",)
    inlines = [OrderItemInline]
    readonly_fields = (
        "order_number",
        "created_at",
        "updated_at",
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = ("order", "menu_item", "quantity","unit_price",)
    search_fields = ("order__order_number", "menu_item__name",)
    list_filter = ("menu_item__category",)
