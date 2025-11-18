from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Contato
from .serializers import ContatoSerializer
from core.permissions import IsOwner

class ContatoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite Contatos serem vistos ou editados.
    """
    serializer_class = ContatoSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        """
        Retorna apenas os contatos do usuário logado.
        """
        return Contato.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """
        Define o 'usuario' automaticamente ao criar um novo contato.
        """
        serializer.save(usuario=self.request.user)