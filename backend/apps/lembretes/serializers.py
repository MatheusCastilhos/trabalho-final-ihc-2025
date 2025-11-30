from rest_framework import serializers
from .models import Lembrete

class LembreteSerializer(serializers.ModelSerializer):

    usuario_username = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = Lembrete
        # Estes são os campos que a API vai aceitar e retornar
        fields = [
            'id', 
            'usuario', 
            'usuario_username',
            'titulo', 
            'descricao', 
            'data_hora', 
            'concluido',
            'criado_em'
        ]

        # Impede que o usuário 'troque' o dono do lembrete
        read_only_fields = ['usuario']