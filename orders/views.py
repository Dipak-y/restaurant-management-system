
from django.db import transaction, IntegrityError

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order, OrderItem
from .serializers import CreateOrderSerializer, OrderSerializer

from table.models import DinningTable
from menu.models import MenuItem
from kitchen.models import KitchenOrder, KitchenOrderItem
from accounts.permissions import IsManagerOrWaiter


class CreateOrderView(generics.CreateAPIView):
    serializer_class = CreateOrderSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        key = data["idempotency_key"]

        existing_order = Order.objects.filter(
            idempotency_key=key
        ).first()

        if existing_order:
            return Response(
                OrderSerializer(existing_order).data,
                status=status.HTTP_200_OK
            )

        try:
            with transaction.atomic():

                try:
                    table = DinningTable.objects.get(
                        qr_token=data["table_token"],
                        is_active=True
                    )
                except DinningTable.DoesNotExist:
                    raise ValidationError({
                        "table_token": "Invalid QR code or table is unavailable."
                    })

                order = Order.objects.create(
                    idempotency_key=key,
                    table=table,
                    customer_name=data.get("customer_name", ""),
                    customer_phone=data.get("customer_phone", ""),
                    notes=data.get("notes", ""),
                    status="PENDING"
                )

                for item in data["items"]:
                    try:
                        menu_item = MenuItem.objects.get(
                            id=item["menu_item_id"],
                            is_available=True,
                            category__is_active=True
                        )
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

                kitchen_order = KitchenOrder.objects.create(
                    order=order
                )

                for order_item in order.items.all():
                    KitchenOrderItem.objects.create(
                        kitchen_order=kitchen_order,
                        order_item=order_item
                    )

        except IntegrityError:
            existing_order = Order.objects.filter(
                idempotency_key=key
            ).first()

            if existing_order:
                return Response(
                    OrderSerializer(existing_order).data,
                    status=status.HTTP_200_OK
                )

            raise

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsManagerOrWaiter]

    def get_queryset(self):
        return (
            Order.objects
            .select_related("table")
            .prefetch_related("items__menu_item")
            .order_by("-created_at")
        )


class VerifyOrderView(APIView):
    permission_classes = [IsManagerOrWaiter]

    def post(self, request, pk):
        try:
            with transaction.atomic():

                order = Order.objects.select_for_update().get(pk=pk)

                if order.status != "PENDING":
                    return Response(
                        {"detail": "Only pending orders can be verified."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                kitchen_order = KitchenOrder.objects.select_for_update().filter(
                    order=order
                ).first()

                if not kitchen_order:
                    return Response(
                        {"detail": "Kitchen order not found."},
                        status=status.HTTP_404_NOT_FOUND
                    )

                order.status = "VERIFIED"
                order.save(update_fields=["status", "updated_at"])

                kitchen_order.status = "PREPARING"
                kitchen_order.save(
                    update_fields=["status", "updated_at"]
                )

        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "message": "Order verified and sent to kitchen successfully.",
            "order": OrderSerializer(order).data,
            "kitchen_status": kitchen_order.status
        })


class CustomerOrderTrackingView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        order_number = request.data.get("order_number")
        customer_phone = request.data.get("customer_phone")

        if not order_number or not customer_phone:
            return Response(
                {
                    "detail": "Order number and phone number are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            order = Order.objects.select_related(
                "table"
            ).prefetch_related(
                "items__menu_item"
            ).get(
                order_number=order_number,
                customer_phone=customer_phone
            )

        except Order.DoesNotExist:
            return Response(
                {
                    "detail": "Order not found. Please check your details."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )


class ServeOrderView(APIView):
    permission_classes = [IsManagerOrWaiter]

    def post(self, request, pk):
        try:
            with transaction.atomic():

                order = Order.objects.select_for_update().get(pk=pk)

                if order.status != "READY":
                    return Response(
                        {
                            "detail": "Only ready orders can be served."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                kitchen_order = KitchenOrder.objects.select_for_update().filter(
                    order=order
                ).first()

                if not kitchen_order:
                    return Response(
                        {
                            "detail": "Kitchen order not found."
                        },
                        status=status.HTTP_404_NOT_FOUND
                    )

                if kitchen_order.status != "READY":
                    return Response(
                        {
                            "detail": "Kitchen order is not ready yet."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Complete the main order
                order.status = "COMPLETED"
                order.save(update_fields=["status", "updated_at"])

                # Complete the kitchen order
                kitchen_order.status = "COMPLETED"
                kitchen_order.save(
                    update_fields=["status", "updated_at"]
                )

        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "message": "Order served and completed successfully.",
                "order": OrderSerializer(order).data,
                "kitchen_status": kitchen_order.status
            },
            status=status.HTTP_200_OK
        )
