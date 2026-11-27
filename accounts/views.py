
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import IsAdminOrManager
from .serializers import (
    StaffRegistrationSerializer,
    CustomTokenObtainPairSerializer,
)


class StaffRegistrationView(generics.CreateAPIView):
    serializer_class = StaffRegistrationSerializer
    permission_classes = [IsAdminOrManager]


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
