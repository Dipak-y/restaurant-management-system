from rest_framework import generics
from .models import DinningTable
from .serializers import DinningTableSerializer


class DinningTableListView(generics.ListAPIView):
    queryset = DinningTable.objects.filter(is_active=True)
    serializer_class = DinningTableSerializer


class DinningTableDetailView(generics.RetrieveAPIView):
    queryset = DinningTable.objects.filter(is_active=True)
    serializer_class = DinningTableSerializer