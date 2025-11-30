# core/permissions.py
from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Permissão customizada para permitir que apenas o dono de um objeto
    possa editá-lo ou visualizá-lo.
    """

    def has_object_permission(self, request, view, obj):
        # 'obj' é o Lembrete, 'obj.usuario' é o dono do lembrete.
        # 'request.user' é o usuário que está fazendo a chamada (via Token)
        return obj.usuario == request.user