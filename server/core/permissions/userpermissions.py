from rest_framework.permissions import BasePermission


class UserPermissions(BasePermission):
    def has_permission(self, request, view):
        # if view.action == "list":
        #     return request.user.is_authenticated and request.user.is_superuser
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ("retrieve", "update", "partial_update"):
            return (
                request.user.is_authenticated
                and request.user.id == obj.id
                or request.user.is_authenticated
                and request.user.is_superuser
            )
        return True
