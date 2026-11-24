
from django.contrib import admin
from .models import KitchenOrder, KitchenOrderItem


class KitchenOrderItemInline(admin.TabularInline):
    model = KitchenOrderItem
    extra = 0
    autocomplete_fields = ["order_item"]


@admin.register(KitchenOrder)
class KitchenOrderAdmin(admin.ModelAdmin):

    list_display = ("order", "status", "received_at", "updated_at",)

    list_filter = ("status", "received_at")
    search_fields = ("order__customer_name", "order__customer_phone",)
    inlines = [KitchenOrderItemInline]
    readonly_fields = ("received_at", "updated_at",)


@admin.register(KitchenOrderItem)
class KitchenOrderItemAdmin(admin.ModelAdmin):

    list_display = ( "kitchen_order", "order_item", "status",)
    list_filter = ("status",)
    search_fields = ("order_item__menu_item__name", "kitchen_order__order__customer_name",)

    
