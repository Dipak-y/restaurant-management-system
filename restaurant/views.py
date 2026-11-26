from rest_framework import generics
from .models import Restaurant, OperatingHours, RestaurantSettings
from .serializers import (
    RestaurantSerializer,
    OperatingHoursSerializer,
    RestaurantSettingsSerializer,
)


class RestaurantDetailView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantSerializer


class OperatingHoursListView(generics.ListAPIView):
    queryset = OperatingHours.objects.all()
    serializer_class = OperatingHoursSerializer


class RestaurantSettingsView(generics.RetrieveAPIView):
    queryset = RestaurantSettings.objects.select_related("restaurant").filter(
        restaurant__is_active=True
    )
    serializer_class = RestaurantSettingsSerializer