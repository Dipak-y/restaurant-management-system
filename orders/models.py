from django.db import models

# Create your models here.


import uuid
from django.db import models
from menu.models import MenuItem
from table.models import DinningTable


class Order(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending Verification"),
        ("VERIFIED", "Verified"),
        ("PREPARING", "Preparing"),
        ("READY", "Ready"),
        ("SERVED", "Served"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    order_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    table = models.ForeignKey(DinningTable, on_delete=models.PROTECT, related_name="orders")

    customer_name = models.CharField(max_length=100, blank=True)
    customer_phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.order_number}"


class OrderItem(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT, related_name="order_items")
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    special_instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"

    @property
    def subtotal(self):
        return self.unit_price * self.quantity
