from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para criar um novo usuário (Registro).
    """
    class Meta:
        model = User
        # Campos que virão do JSON (do app)
        fields = ('username', 'email', 'password')
        # Define que o 'password' não deve ser lido de volta (só escrita)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user