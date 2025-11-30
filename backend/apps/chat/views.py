from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.utils import timezone

from drf_spectacular.utils import extend_schema

from .models import HistoricoChat
from .engine import ChatEngine
from .serializers import ChatInputSerializer

from apps.lembretes.models import Lembrete
from apps.contatos.models import Contato


@extend_schema(
    request=ChatInputSerializer,
    responses={200: dict},
    description="Envia uma mensagem para o assistente, com histórico e contexto RAG."
)
class ChatAPIView(APIView):
    """
    Endpoint da API para interagir com o ChatEngine.
    """
    permission_classes = [IsAuthenticated]

    # Instância única — suficiente para o projeto
    chat_engine = ChatEngine()

    def _get_rag_context(self, user, now):
        """
        Recupera lembretes, contatos e data/hora atual para montar um
        contexto textual que será injetado no histórico como mensagem de sistema.
        """

        # 1. Recuperar dados relevantes
        lembretes = (
            Lembrete.objects
            .filter(usuario=user, concluido=False, data_hora__gte=now)
            .order_by('data_hora')[:5]
        )

        contatos = Contato.objects.filter(usuario=user, is_emergencia=True)

        # 2. Montar o texto do contexto
        context_parts = []
        context_parts.append(f"Data/Hora Atual: {now.strftime('%d/%m/%Y %H:%M')}")

        if lembretes.exists():
            context_parts.append("\nLEMBRETES PENDENTES:")
            for lem in lembretes:
                context_parts.append(
                    f"- Título: {lem.titulo}, Data: {lem.data_hora.strftime('%d/%m %H:%M')}"
                )

        if contatos.exists():
            context_parts.append("\nCONTATOS DE EMERGÊNCIA:")
            for c in contatos:
                context_parts.append(
                    f"- Nome: {c.nome}, Telefone: {c.telefone}"
                )

        # Se só tem a data/hora, então nada relevante foi encontrado
        if len(context_parts) > 1:
            return "\n".join(context_parts)

        return None

    def post(self, request, *args, **kwargs):
        # 1. Validar o JSON de entrada
        serializer = ChatInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user_input = serializer.validated_data["message"]
        now = timezone.now()

        # 2. Recuperar histórico do usuário
        history_qs = HistoricoChat.objects.filter(usuario=user)
        history_list = [h.to_dict() for h in history_qs]

        # 3. Gerar contexto RAG
        rag_context = self._get_rag_context(user, now)

        if rag_context:
            history_list.append({
                "role": "system",
                "content": (
                    "--- INÍCIO: CONTEXTO DO USUÁRIO ---\n"
                    f"{rag_context}\n"
                    "--- FIM: CONTEXTO DO USUÁRIO ---"
                ),
            })

        # 4. Chamada ao modelo
        try:
            answer = self.chat_engine.send_message(user_input, history_list)
        except Exception as e:
            return Response(
                {"error": f"Erro ao processar a mensagem: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # 5. Persistir histórico
        HistoricoChat.objects.bulk_create([
            HistoricoChat(usuario=user, role='user', content=user_input),
            HistoricoChat(usuario=user, role='assistant', content=answer),
        ])

        # 6. Retornar resposta
        return Response({"resposta": answer}, status=status.HTTP_200_OK)