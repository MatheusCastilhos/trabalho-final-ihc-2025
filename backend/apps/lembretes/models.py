from django.db import models
from django.contrib.auth.models import User

class Lembrete(models.Model):

    TIPO_CHOICES = [
        ("medicamento", "Medicamento"),
        ("refeicao", "Refeição"),
        ("consulta", "Consulta"),
        ("outro", "Outro"),
    ]

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='lembretes'
    )
    
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    data_hora = models.DateTimeField()
    concluido = models.BooleanField(default=False)

    # 🔥 Novo campo — tipo do lembrete
    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES,
        default="outro",
    )
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"'{self.titulo}' para {self.usuario.username}"