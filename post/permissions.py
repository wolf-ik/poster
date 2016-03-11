from rest_framework import permissions


class IsObjectOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user:
            return request.user.is_staff or obj.owner == request.user
        return False
