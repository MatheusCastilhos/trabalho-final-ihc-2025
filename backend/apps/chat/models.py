from django.db import models
from django.contrib.auth.models import User

class HistoricoChat(models.Model):
    # O usuário dono desta mensagem
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='historico_chat')

    # O "papel": 'user' (para mensagem do usuário) ou 'assistant' (para resposta da IA)
    role = models.CharField(max_length=10, choices=[('user', 'User'), ('assistant', 'Assistant')])

    # O conteúdo da mensagem
    content = models.TextField()

    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ordena as mensagens da mais antiga para a mais nova
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.usuario.username} ({self.role}): {self.content[:30]}..."

    def to_dict(self):
        """Converte o objeto para o formato que a IA espera."""
        return {"role": self.role, "content": self.content}