from rest_framework import serializers
from .models import EntradaDiario

class EntradaDiarioSerializer(serializers.ModelSerializer):
    usuario_username = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = EntradaDiario
        fields = [
            'id', 
            'usuario',
            'usuario_username',
            'texto', 
            'foto', 
            'audio',
            'data_criacao'
        ]
        read_only_fields = ['usuario']