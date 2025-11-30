from django.contrib.auth.models import User
from rest_framework import serializers
import unicodedata


def normalize_username(raw: str) -> str:
    """
    Converte username para:
    - sem espaços nas pontas
    - minúsculo
    - sem acentos
    """
    if not raw:
        return ""
    normalized = unicodedata.normalize("NFD", raw.strip().lower())
    normalized = "".join(
        ch for ch in normalized
        if unicodedata.category(ch) != "Mn"
    )
    return normalized


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para criar um novo usuário (Registro).
    """
    class Meta:
        model = User
        # Campos que virão do JSON (do app)
        fields = ("username", "email", "password")
        # Define que o 'password' não deve ser lido de volta (só escrita)
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Garante username normalizado mesmo se alguém chamar o serializer direto
        username = normalize_username(validated_data.get("username", ""))
        email = validated_data.get("email", "")
        password = validated_data.get("password", "")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        return user