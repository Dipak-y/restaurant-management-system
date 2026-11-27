
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from accounts.permissions import IsKitchen
from .models import KitchenOrder, KitchenOrderItem
from .serializers import KitchenOrderSerializer, KitchenOrderItemSerializer



class KitchenOrderListView(generics.ListAPIView):
    serializer_class = KitchenOrderSerializer
    permission_classes = [IsKitchen]

    def get_queryset(self):
        return (
            KitchenOrder.objects
            .select_related(
                "order",
                "order__table"
            )
            .prefetch_related(
                "items__order_item__menu_item"
            )
            .filter(order__status__in=["VERIFIED", "PREPARING", "READY",],
                status__in=[
                    "PENDING",
                    "ACCEPTED",
                    "PREPARING",
                    "READY",
                ]
            )
            .order_by("received_at")
        )



class KitchenOrderStatusUpdateView(APIView):
    permission_classes = [IsKitchen]

    def patch(self, request, pk):
        kitchen_order = get_object_or_404(
            KitchenOrder,
            pk=pk
        )

        new_status = request.data.get("status")

        allowed_transitions = {
            "PENDING": ["ACCEPTED"],
            "ACCEPTED": ["PREPARING"],
            "PREPARING": ["READY"],
            "READY": ["COMPLETED"],
        }

        current_status = kitchen_order.status

        if new_status not in allowed_transitions.get(current_status, []):
            return Response(
                {
                    "error": (
                        f"Cannot change status from "
                        f"{current_status} to {new_status}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        kitchen_order.status = new_status
        kitchen_order.save(
            update_fields=["status", "updated_at"]
        )

        # Update main order when kitchen marks it READY
        if new_status == "READY":
            order = kitchen_order.order
            order.status = "READY"
            order.save(
                update_fields=["status", "updated_at"]
            )

        return Response(
            {
                "message": "Kitchen order status updated successfully.",
                "order": KitchenOrderSerializer(kitchen_order).data
            },
            status=status.HTTP_200_OK
        )



class KitchenOrderItemStatusUpdateView(APIView):
    permission_classes = [IsKitchen]

    def patch(self, request, pk):
        kitchen_item = get_object_or_404(KitchenOrderItem, pk=pk)

        new_status = request.data.get("status")

        allowed_transitions = {
            "PENDING": ["PREPARING"],
            "PREPARING": ["READY"],
        }

        current_status = kitchen_item.status

        if new_status not in allowed_transitions.get(current_status, []):
            return Response(
                {
                    "error": (
                        f"Cannot change status from "
                        f"{current_status} to {new_status}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        kitchen_item.status = new_status
        kitchen_item.save(update_fields=["status"])

        kitchen_order = kitchen_item.kitchen_order

        if not kitchen_order.items.exclude(status="READY").exists():
            kitchen_order.status = "READY"
            kitchen_order.save(update_fields=["status", "updated_at"])

            order = kitchen_order.order
            order.status = "READY"
            order.save(update_fields=["status", "updated_at"])

        return Response(
            {
                "message": "Kitchen item status updated successfully.",
                "item": KitchenOrderItemSerializer(kitchen_item).data
            },
            status=status.HTTP_200_OK
        )
