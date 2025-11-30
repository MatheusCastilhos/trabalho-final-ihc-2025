from rest_framework import serializers
from .models import Contato

class ContatoSerializer(serializers.ModelSerializer):
    usuario_username = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = Contato
        fields = [
            'id',
            'usuario',
            'usuario_username',
            'nome',
            'telefone',
            'foto',
            'is_emergencia',
            'criado_em',
        ]
        read_only_fields = ['usuario']
        extra_kwargs = {
            "foto": {"required": False, "allow_null": True},
        }