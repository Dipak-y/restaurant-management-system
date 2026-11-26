from django.urls import path
from restaurant.views import RestaurantSettingsView, RestaurantDetailView, OperatingHoursListView

urlpatterns = [
    path("<int:pk>/", RestaurantDetailView.as_view(), name="restaurant-detail"),
    path("hours/", OperatingHoursListView.as_view(), name="operating-hours"),
    path("settings/<int:pk>/", RestaurantSettingsView.as_view(), name="restaurant-settings"),
]