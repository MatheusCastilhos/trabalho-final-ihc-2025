# backend/apps/core/serializers.py
from django.contrib.auth.models import User
from django.utils.text import slugify
from rest_framework import serializers

from .models import PerfilPaciente


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para criar um novo usuário (Registro).
    Além de username/email/senha, recebe:
    - nome_completo
    - data_nascimento (YYYY-MM-DD)
    """

    nome_completo = serializers.CharField(write_only=True)
    data_nascimento = serializers.DateField(write_only=True)

    class Meta:
        model = User
        # Campos que virão do JSON (do app)
        fields = ("username", "email", "password", "nome_completo", "data_nascimento")
        # Define que o 'password' não deve ser lido de volta (só escrita)
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Pega os dados extras do perfil
        nome_completo = validated_data.pop("nome_completo")
        data_nascimento = validated_data.pop("data_nascimento")

        # Normalizar username: minúsculo e sem acentos
        raw_username = validated_data["username"]
        username_normalizado = slugify(raw_username).replace("-", "")
        if not username_normalizado:
            username_normalizado = raw_username.lower()

        email = validated_data.get("email", "")
        password = validated_data["password"]

        # Cria o User
        user = User.objects.create_user(
            username=username_normalizado,
            email=email,
            password=password,
        )

        # Cria o perfil do paciente
        PerfilPaciente.objects.create(
            usuario=user,
            nome_completo=nome_completo,
            data_nascimento=data_nascimento,
        )

        return user