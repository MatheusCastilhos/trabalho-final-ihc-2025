from rest_framework import viewsets, permissions

from .models import Lembrete
from .serializers import LembreteSerializer
from apps.core.permissions import IsOwner


class LembreteViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite Lembretes serem vistos ou editados.
    """
    serializer_class = LembreteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        """
        Retorna apenas os lembretes do usuário autenticado.
        """
        return Lembrete.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """
        Define o 'usuario' automaticamente ao criar um novo lembrete.
        """
        serializer.save(usuario=self.request.user)