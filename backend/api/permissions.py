from rest_framework.permissions import BasePermission

class IsAdminPermission(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

class IsAdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in ['GET']:  
            return True

        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

