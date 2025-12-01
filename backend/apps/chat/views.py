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

    def get_engine(self):
        """
        Instancia o ChatEngine sob demanda.
        Isso previne erros de carregamento de .env durante o 'migrate'.
        """
        if not hasattr(self, '_chat_engine'):
            self._chat_engine = ChatEngine()
        return self._chat_engine

    def _get_rag_context(self, user, now):
        """
        Recupera lembretes do DIA ATUAL (passados e futuros) e contatos
        para montar um contexto textual para a IA.
        """
        
        # Converte para o horário local para filtrar corretamente pelo "dia de hoje"
        today_local = timezone.localtime(now).date()

        # 1. Recuperar lembretes:
        # Filtramos por DATA igual a hoje (data_hora__date=today_local).
        # Assim pegamos lembretes das 08:00 mesmo se agora forem 20:00.
        lembretes = (
            Lembrete.objects
            .filter(
                usuario=user, 
                concluido=False, 
                data_hora__date=today_local 
            )
            .order_by('data_hora')
        )

        contatos = Contato.objects.filter(usuario=user, is_emergencia=True)

        # Definição do nome do paciente
        nome_paciente = user.first_name if user.first_name else user.username

        # 2. Montar o texto do contexto
        context_parts = []
        
        # Cabeçalho do Contexto
        context_parts.append(f"Nome do Paciente: {nome_paciente}")
        context_parts.append(f"Data/Hora Atual: {timezone.localtime(now).strftime('%d/%m/%Y %H:%M')}")

        # Lista de Lembretes
        if lembretes.exists():
            context_parts.append("\nAGENDA DE HOJE (PENDENTES/ATIVOS):")
            for lem in lembretes:
                # Formata hora limpa (ex: 14:30)
                hora_local = timezone.localtime(lem.data_hora).strftime('%H:%M')
                # Ex: - [14:30] Tomar remédio X (Medicamento)
                context_parts.append(
                    f"- [{hora_local}] {lem.titulo} (Tipo: {lem.get_tipo_display()})"
                )
        else:
            context_parts.append("\nNão há lembretes agendados para hoje.")

        # Lista de Contatos
        if contatos.exists():
            context_parts.append("\nCONTATOS DE EMERGÊNCIA:")
            for c in contatos:
                context_parts.append(
                    f"- Nome: {c.nome}, Telefone: {c.telefone}"
                )

        return "\n".join(context_parts)

    def get(self, request, *args, **kwargs):
        """
        Retorna o histórico de conversas do usuário.
        """
        history_qs = HistoricoChat.objects.filter(usuario=request.user)
        
        data = []
        for h in history_qs:
            if h.role == 'system':
                continue
                
            data.append({
                "id": h.id,
                "role": h.role,
                "content": h.content,
                "timestamp": h.timestamp
            })
            
        return Response(data, status=status.HTTP_200_OK)

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

        # 3. Gerar contexto RAG atualizado
        rag_context = self._get_rag_context(user, now)

        # Injetamos o contexto atualizado como uma instrução de sistema
        # imediatamente antes da resposta da IA, para garantir prioridade.
        history_list.append({
            "role": "system",
            "content": (
                "--- CONTEXTO ATUALIZADO (RAG) ---\n"
                "Use as informações abaixo se forem relevantes para responder ao usuário:\n"
                f"{rag_context}\n"
                "-----------------------------------"
            ),
        })

        # 4. Chamada ao modelo
        try:
            engine = self.get_engine()
            answer = engine.send_message(user_input, history_list)
        except Exception as e:
            return Response(
                {"error": f"Erro na IA: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # 5. Persistir histórico
        # Salvamos apenas o que foi dito, não o contexto técnico injetado
        HistoricoChat.objects.bulk_create([
            HistoricoChat(usuario=user, role='user', content=user_input),
            HistoricoChat(usuario=user, role='assistant', content=answer),
        ])

        # 6. Retornar resposta
        return Response({"resposta": answer}, status=status.HTTP_200_OK)