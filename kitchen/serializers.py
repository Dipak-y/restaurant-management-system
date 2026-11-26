from rest_framework import serializers
from .models import KitchenOrder, KitchenOrderItem


class KitchenOrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source="order_item.menu_item.name", read_only=True)
    quantity = serializers.IntegerField(source="order_item.quantity", read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = KitchenOrderItem
        fields = [
            "id",
            "order_item",
            "menu_item_name",
            "quantity",
            "status",
            "notes",
        ]


class KitchenOrderSerializer(serializers.ModelSerializer):
    order_number = serializers.UUIDField(source="order.order_number", read_only=True)
    table_number = serializers.CharField(source="order.table.table_number",read_only=True)
    items = KitchenOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = KitchenOrder
        fields = [
            "id",
            "order",
            "order_number",
            "table_number",
            "status",
            "notes",
            "items",
            "received_at",
            "updated_at",
        ]
        read_only_fields = [
            "received_at",
            "updated_at",
        ]