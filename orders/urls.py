from django.urls import path
from .views import CreateOrderView, OrderListView, VerifyOrderView, CustomerOrderTrackingView, ServeOrderView

urlpatterns = [
    path("", CreateOrderView.as_view(), name="create-order"),
    path("list/", OrderListView.as_view(), name="order-list"),
    path("<int:pk>/verify/", VerifyOrderView.as_view(), name="verifyi-order"),
    path("my-order/", CustomerOrderTrackingView.as_view(), name="customer-order-tracking"),
    path("<int:pk>/serve/", ServeOrderView.as_view(), name="serve-order"),]

