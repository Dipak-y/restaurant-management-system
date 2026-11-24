from django.urls import path
from .views import DinningTableDetailView, DinningTableListView

urlpatterns = [
    path("", DinningTableListView.as_view(), name="table-list"),
    path("<int:pk>/", DinningTableDetailView.as_view(), name="table-detail"),
]