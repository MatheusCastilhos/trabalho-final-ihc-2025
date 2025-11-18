
from django.db import models
from django.contrib.auth.models import User

class EntradaDiario(models.Model):
   
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entradas_diario')
    
 
    texto = models.TextField(blank=True, null=True)
    
 
    foto = models.ImageField(upload_to='diario_fotos/', blank=True, null=True)
    
    
    audio = models.FileField(upload_to='diario_audios/', blank=True, null=True)
    
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.texto:
            return f"Diário de {self.usuario.username}: {self.texto[:50]}..."
        elif self.foto:
            return f"Diário de {self.usuario.username}: [Foto]"
        elif self.audio:
            return f"Diário de {self.usuario.username}: [Áudio]"
        return f"Diário de {self.usuario.username}: [Entrada Vazia]"