from rest_framework.permissions import BasePermission

from ..models import Company, Job, Post, PostSolution


class BaseCUDPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        obj_request = self._get_request_obj(request, obj)
        if view.action in ("update", "partial_update", "destroy"):
            return (
                request.user.is_authenticated
                and obj_request.user.id == obj.id
                or request.user.is_authenticated
                and request.user.is_superuser
            )
        return True

    def _get_request_obj(self, request, obj):
        return request
        # if isinstance(obj, (Company, Job)):
        #     return request
        # if isinstance(obj, Post):
        #     return request
        # if isinstance(obj, PostSolution):
        #     return request
