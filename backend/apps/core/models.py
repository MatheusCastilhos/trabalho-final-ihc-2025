# backend/apps/core/models.py
from django.db import models
from django.contrib.auth.models import User


class PerfilPaciente(models.Model):
    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="perfil_paciente",
    )
    nome_completo = models.CharField(max_length=255)
    data_nascimento = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome_completo} ({self.usuario.username})"