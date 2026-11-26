from django.urls import path
from .views import DinningTableDetailView, DinningTableListView, TableQRLookupView

urlpatterns = [
    path("", DinningTableListView.as_view(), name="table-list"),
    path("<int:pk>/", DinningTableDetailView.as_view(), name="table-detail"),
    path("qr/<uuid:qr_token>/", TableQRLookupView.as_view(), name="table-qr-lookup"),
]