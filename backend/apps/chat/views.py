# backend/apps/chat/views.py
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

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
        Monta um texto de contexto com:
        - Dados do paciente (nome, data de nascimento, idade aproximada)
        - Data/hora atual (em horário local)
        - Lembretes pendentes
        - Contatos de emergência
        """

        context_parts = []

        # 1) Dados do paciente (PerfilPaciente ligado ao User)
        #    Assumindo OneToOneField com related_name="perfil_paciente"
        perfil = getattr(user, "perfil_paciente", None)
        if perfil:
            # Nome
            nome = perfil.nome_completo or user.username

            # Data de nascimento + idade aproximada
            linha_paciente = f"- Nome: {nome}"
            idade_str = None

            if perfil.data_nascimento:
                linha_paciente += (
                    f", Data de nascimento: "
                    f"{perfil.data_nascimento.strftime('%d/%m/%Y')}"
                )

                # Idade aproximada (em anos)
                today = timezone.localdate()
                dn = perfil.data_nascimento
                idade = (
                    today.year
                    - dn.year
                    - ((today.month, today.day) < (dn.month, dn.day))
                )
                idade_str = f"{idade} anos"

            if idade_str:
                linha_paciente += f" (idade aproximada: {idade_str})"

            context_parts.append("DADOS DO PACIENTE:")
            context_parts.append(linha_paciente)
            context_parts.append("")  # linha em branco para separar

        # 2) Data/hora atual — converte para timezone local do Django
        now_local = timezone.localtime(now)
        context_parts.append(
            f"Data/Hora Atual: {now_local.strftime('%d/%m/%Y %H:%M')}"
        )

        # 3) Lembretes pendentes (comparação em UTC, exibição em local)
        lembretes = (
            Lembrete.objects
            .filter(usuario=user, concluido=False, data_hora__gte=now)
            .order_by('data_hora')[:5]
        )

        if lembretes.exists():
            context_parts.append("\nLEMBRETES PENDENTES:")
            for lem in lembretes:
                lem_local = timezone.localtime(lem.data_hora)
                context_parts.append(
                    f"- Título: {lem.titulo}, "
                    f"Data/Hora: {lem_local.strftime('%d/%m %H:%M')}"
                )

        # 4) Contatos de emergência
        contatos = Contato.objects.filter(usuario=user, is_emergencia=True)
        if contatos.exists():
            context_parts.append("\nCONTATOS DE EMERGÊNCIA:")
            for c in contatos:
                context_parts.append(
                    f"- Nome: {c.nome}, Telefone: {c.telefone}"
                )

        # Junta tudo em um único bloco de texto
        return "\n".join(context_parts)

    def post(self, request, *args, **kwargs):
        # 1. Validar o JSON de entrada
        serializer = ChatInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        user_input = serializer.validated_data["message"]
        now = timezone.now()

        # 2. Recuperar histórico do usuário
        history_qs = HistoricoChat.objects.filter(usuario=user)
        history_list = [h.to_dict() for h in history_qs]

        # 3. Gerar contexto RAG (dados do paciente + lembretes + contatos)
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

        # 5. Persistir histórico (no banco, em UTC mesmo)
        HistoricoChat.objects.bulk_create([
            HistoricoChat(usuario=user, role='user', content=user_input),
            HistoricoChat(usuario=user, role='assistant', content=answer),
        ])

        # 6. Retornar resposta
        return Response({"resposta": answer}, status=status.HTTP_200_OK)