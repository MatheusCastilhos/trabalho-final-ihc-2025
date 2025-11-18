from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import EntradaDiario
from .serializers import EntradaDiarioSerializer
from core.permissions import IsOwner 

class EntradaDiarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite Entradas do Diário serem vistas ou editadas.
    """
    serializer_class = EntradaDiarioSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        """
        Retorna apenas as entradas de diário do usuário logado,
        ordenadas da mais recente para a mais antiga.
        """
        return EntradaDiario.objects.filter(usuario=self.request.user).order_by('-data_criacao')

    def perform_create(self, serializer):
        """
        Define o 'usuario' automaticamente ao criar uma nova entrada.
        """
        serializer.save(usuario=self.request.user)