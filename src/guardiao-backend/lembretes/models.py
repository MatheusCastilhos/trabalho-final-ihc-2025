from django.db import models
from django.contrib.auth.models import User

class Lembrete(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lembretes')
    
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True) # Campo opcional
    data_hora = models.DateTimeField()
    concluido = models.BooleanField(default=False)
    
    criado_em = models.DateTimeField(auto_now_add=True) # Data de criação automática

    def __str__(self):
        return f"'{self.titulo}' para {self.usuario.username}"