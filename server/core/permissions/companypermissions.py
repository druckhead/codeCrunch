from rest_framework.permissions import BasePermission
from .basepermissions import BaseCUDPermission


class CompanyPermissions(BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if view.action == "destroy":
            return request.user.is_authenticated and request.user.is_superuser
        return True
