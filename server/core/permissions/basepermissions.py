from rest_framework.permissions import BasePermission


class BaseCUDPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ("update", "partial_update"):
            return request.user.is_authenticated and request.post.user.id == obj.id
        if view.action == "delete":
            return bool(
                request.user.is_authenticated
                and request.post.user.id == obj.id
                or request.user.is_superuser
            )
