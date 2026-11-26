
from django.contrib.auth.models import User
from rest_framework import serializers
from django.db import transaction
from .models import StaffProfile

class StaffRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(
        source="user.first_name", required=False, allow_blank=True
    )
    last_name = serializers.CharField(
        source="user.last_name", required=False, allow_blank=True
    )
    email = serializers.EmailField(
        source="user.email", required=False, allow_blank=True
    )

    class Meta:
        model = StaffProfile
        fields = [
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "role",
            "phone",
        ]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )
        return value

    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop("user")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **user_data
        )

        staff_profile = StaffProfile.objects.create(
            user=user,
            **validated_data
        )

        return staff_profile
