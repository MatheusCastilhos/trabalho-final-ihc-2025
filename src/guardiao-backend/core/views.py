from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny]) 
def register_view(request):
    """
    View para registrar um novo usuário.
    Recebe 'username', 'email', 'password' via POST.
    """
    serializer = UserSerializer(data=request.data) 

    if serializer.is_valid():
        # Salva o novo usuário no banco
        user = serializer.save()

        # Cria um token para o novo usuário
        token = Token.objects.create(user=user)

        # Retorna o token e uma msg de sucesso
        data = {
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        }
        return Response(data, status=status.HTTP_201_CREATED)

    # Se os dados não forem válidos (ex: usuário já existe)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated]) # SÓ quem está logado (tem token) pode deslogar
def logout_view(request):
    """
    View para fazer logout.
    Deleta o token de autenticação do usuário.
    """
    try:
        request.user.auth_token.delete()
        return Response(
            {"detail": "Logout realizado com sucesso."},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
