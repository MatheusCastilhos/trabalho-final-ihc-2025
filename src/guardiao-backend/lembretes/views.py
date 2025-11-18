from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Lembrete
from .serializers import LembreteSerializer
from core.permissions import IsOwner 

class LembreteViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite Lembretes serem vistos ou editados.
    """
    serializer_class = LembreteSerializer


    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        """
        Esta view deve retornar uma lista de todos os lembretes
        apenas para o usuário autenticado.
        """
        # Filtra o queryset para pegar apenas lembretes
        # do usuário que fez o request.
        return Lembrete.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """
        Ao criar um novo lembrete (POST),
        define o 'usuario' automaticamente como o usuário logado.
        """
        serializer.save(usuario=self.request.user)