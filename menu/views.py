
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Category, MenuItem
from .serializers import CategorySerializer, MenuItemSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class MenuItemListView(generics.ListAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = MenuItem.objects.filter(
            is_available=True,
            category__is_active=True
        )

        category_id = self.request.query_params.get("category")

        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset


class MenuItemDetailView(generics.RetrieveAPIView):
    queryset = MenuItem.objects.filter(
        is_available=True,
        category__is_active=True
    )
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]
