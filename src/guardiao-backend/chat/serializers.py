# chat/serializers.py
from rest_framework import serializers

class ChatInputSerializer(serializers.Serializer):
    mensagem = serializers.CharField(trim_whitespace=False)