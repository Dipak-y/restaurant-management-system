from rest_framework import serializers
from .models import Restaurant, OperatingHours, RestaurantSettings


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = "__all__"

class OperatingHoursSerializer(serializers.ModelSerializer):  
    day_display  = serializers. CharField(source="get_day_display", read_only=True)
    class Meta:
        model = OperatingHours
        fields = "__all__"
              