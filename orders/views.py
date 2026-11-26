
from django.db import transaction
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from .models import Order, OrderItem
from .serializers import CreateOrderSerializer
from table.models import DiningTable
from menu.models import MenuItem


class CreateOrderView(generics.CreateAPIView):
    serializer_class = CreateOrderSerializer
    permission_classes = [AllowAny]

    @transaction.atomic
    def perform_create(self, serializer):
        data = serializer.validated_data

        # Check table QR code
        try:
            table = DiningTable.objects.get(qr_token=data["table_token"], is_active=True)
        except DiningTable.DoesNotExist:
            raise ValidationError({
                "table_token": "Invalid QR code or table is unavailable."
            })

        # Create main order
        order = Order.objects.create(table=table, customer_name=data.get("customer_name", ""), customer_phone=data.get("customer_phone", ""), notes=data.get("notes", ""), status="PENDING")

        # Create order items
        for item in data["items"]:
            try:
                menu_item = MenuItem.objects.get(id=item["menu_item_id"], is_available=True, category__is_active=True)
            except MenuItem.DoesNotExist:
                raise ValidationError({
                    "menu_item_id": (
                        f"Menu item with ID {item['menu_item_id']} "
                        "does not exist or is unavailable."
                    )
                })

            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=item["quantity"],
                unit_price=menu_item.price,
                special_instructions=item.get(
                    "special_instructions", ""
                )
            )
