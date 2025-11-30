from rest_framework import serializers

class ChatInputSerializer(serializers.Serializer):
    message = serializers.CharField(trim_whitespace=False)