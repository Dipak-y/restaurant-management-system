
from django.urls import path
from .views import KitchenOrderListView,KitchenOrderStatusUpdateView, KitchenOrderItemStatusUpdateView

urlpatterns = [
    path("orders/", KitchenOrderListView.as_view(), name="kitchen-order-list"),
    path("orders/", KitchenOrderListView.as_view(), name="kitchen-order-list"),
    path("orders/<int:pk>/status/", KitchenOrderStatusUpdateView.as_view(), name="kitchen-order-status-update"),
    path("orders/", KitchenOrderListView.as_view(), name="kitchen-order-list"),
    path("orders/<int:pk>/status/", KitchenOrderStatusUpdateView.as_view(), name="kitchen-order-status-update"),
    path("items/<int:pk>/status/", KitchenOrderItemStatusUpdateView.as_view(), name="kitchen-item-status-update"),
]
