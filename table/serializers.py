from rest_framework import serializers
from .models import DinningTable


class DinningTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = DinningTable
        fields = "__all__"
        read_only_fields = [
            "qr_token",
            "created_at",
            "updated_at",
        ]


class PublicTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = DinningTable
        fields = [
            "table_number",
            "capacity",
            "section",
        ]        