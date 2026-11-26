from rest_framework import generics
from .permissions import IsAdminOrManager
from .serializers import StaffRegistrationSerializer

class StaffRegistrationView(generics.CreateAPIView):
    serializer_class = StaffRegistrationSerializer
    permission_classes = [IsAdminOrManager]