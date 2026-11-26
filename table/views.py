from rest_framework import generics
from .models import DinningTable
from .serializers import DinningTableSerializer, PublicTableSerializer
from rest_framework.permissions import AllowAny
from accounts.permissions import IsAdminOrManager


class DinningTableListView(generics.ListAPIView):
    queryset = DinningTable.objects.filter(is_active=True)
    serializer_class = DinningTableSerializer
    permission_classes = [IsAdminOrManager]


class DinningTableDetailView(generics.RetrieveAPIView):
    queryset = DinningTable.objects.filter(is_active=True)
    serializer_class = DinningTableSerializer
    permission_classes = [IsAdminOrManager]


class TableQRLookupView(generics.RetrieveAPIView):
    serializer_class = PublicTableSerializer
    lookup_field = "qr_token"
    lookup_url_kwarg = "qr_token"
    permission_classes = [AllowAny]

    def get_queryset(self):
        return DinningTable.objects.filter(is_active=True)