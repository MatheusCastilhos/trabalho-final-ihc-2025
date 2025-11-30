from django.db import models
from django.contrib.auth.models import User

class Contato(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contatos')
    
    nome = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20)
    
    # Campo para upload de imagem. As fotos serão salvas em 'media/contato_fotos/'
    foto = models.ImageField(upload_to='contato_fotos/', blank=True, null=True)
    
    # Flag para marcar se é um contato de emergência 
    is_emergencia = models.BooleanField(default=False) 
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.usuario.username})"