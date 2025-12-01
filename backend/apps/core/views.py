from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from drf_spectacular.utils import extend_schema, OpenApiTypes

from django.contrib.auth import authenticate
import unicodedata

from .serializers import UserSerializer
from .models import PerfilPaciente


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
    # remove caracteres de acento (combining marks)
    normalized = "".join(
        ch for ch in normalized
        if unicodedata.category(ch) != "Mn"
    )
    return normalized


@extend_schema(
    request=UserSerializer,
    responses={
        201: OpenApiTypes.OBJECT,
        400: OpenApiTypes.OBJECT,
    },
    description=(
        "Registra um novo usuário/paciente.\n\n"
        "Campos esperados no corpo da requisição:\n"
        "- username (string)\n"
        "- email (string)\n"
        "- password (string)\n"
        "- nome_completo (string)\n"
        "- data_nascimento (string, formato YYYY-MM-DD)\n\n"
        "O username é normalizado (minúsculo e sem acentos) antes de ser salvo.\n\n"
        "Retorna um token de autenticação e informações básicas do usuário/paciente."
    ),
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    View para registrar um novo usuário/paciente.
    Recebe 'username', 'email', 'password', 'nome_completo', 'data_nascimento' via POST.
    """
    data = request.data.copy()

    # Normaliza username antes de passar para o serializer
    if "username" in data:
        data["username"] = normalize_username(data["username"])

    serializer = UserSerializer(data=data)

    if serializer.is_valid():
        # Salva o novo usuário (e o PerfilPaciente dentro do serializer)
        user = serializer.save()

        # Cria um token para o novo usuário
        token = Token.objects.create(user=user)

        # Tenta recuperar o perfil do paciente
        perfil = getattr(user, "perfil_paciente", None)

        # Monta resposta
        resp_data = {
            "token": token.key,
            "user_id": user.pk,
            "username": user.username,
            "email": user.email,
        }

        if perfil:
            resp_data["nome_completo"] = perfil.nome_completo
            resp_data["data_nascimento"] = str(perfil.data_nascimento)

        return Response(resp_data, status=status.HTTP_201_CREATED)

    # Se os dados não forem válidos (ex: usuário já existe)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=OpenApiTypes.OBJECT,
    responses={
        200: OpenApiTypes.OBJECT,
        400: OpenApiTypes.OBJECT,
    },
    description=(
        "Realiza login de um usuário.\n\n"
        "Campos esperados no corpo da requisição:\n"
        "- username (string)\n"
        "- password (string)\n\n"
        "O username é normalizado (minúsculo e sem acentos) antes de autenticar.\n\n"
        "Retorna um token de autenticação e dados básicos do usuário, "
        "incluindo nome completo e data de nascimento, se o PerfilPaciente existir."
    ),
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    View de login customizada.
    Normaliza o username (minúsculo + sem acentos) antes de autenticar.
    """
    username_raw = request.data.get("username", "")
    password = request.data.get("password", "")

    if not username_raw or not password:
        return Response(
            {"detail": "Informe username e password."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    username = normalize_username(username_raw)

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {"detail": "Credenciais inválidas."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)

    perfil = getattr(user, "perfil_paciente", None)

    data = {
        "token": token.key,
        "user_id": user.pk,
        "username": user.username,
        "email": user.email,
    }

    if perfil:
        data["nome_completo"] = perfil.nome_completo
        data["data_nascimento"] = str(perfil.data_nascimento)

    return Response(data, status=status.HTTP_200_OK)


@extend_schema(
    responses={
        200: OpenApiTypes.OBJECT,
        500: OpenApiTypes.OBJECT,
    },
    description=(
        "Realiza logout do usuário autenticado, "
        "removendo o token de autenticação atual."
    ),
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # SÓ quem está logado (tem token) pode deslogar
def logout_view(request):
    """
    View para fazer logout.
    Deleta o token de autenticação do usuário.
    """
    try:
        request.user.auth_token.delete()
        return Response(
            {"detail": "Logout realizado com sucesso."},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )