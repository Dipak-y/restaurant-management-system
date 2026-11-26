
from rest_framework.permissions import BasePermission
from .models import StaffProfile


class RolePermission(BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Admin has full access
        if user.is_superuser:
            return True

        return StaffProfile.objects.filter(
            user=user,
            role__in=self.allowed_roles,
            is_active=True
        ).exists()


class IsAdmin(RolePermission):
    allowed_roles = []


class IsManager(RolePermission):
    allowed_roles = ["MANAGER"]


class IsWaiter(RolePermission):
    allowed_roles = ["WAITER"]


class IsKitchen(RolePermission):
    allowed_roles = ["KITCHEN"]


class IsAdminOrManager(RolePermission):
    allowed_roles = ["MANAGER"]
