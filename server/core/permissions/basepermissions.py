from rest_framework.permissions import BasePermission

from ..models import Post, PostSolution


class BaseCUDPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        obj_or_objuser = self._get_obj_or_objuser(obj)
        if view.action in ("update", "partial_update", "destroy"):
            return (
                request.user.is_authenticated
                and request.user.id == obj_or_objuser.id
                or request.user.is_authenticated
                and request.user.is_superuser
            )
        return True

    def _get_obj_or_objuser(self, obj):
        if isinstance(obj, (Post, PostSolution)):
            return obj.user
        return obj
