from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import HistoricoChat
from .engine import ChatEngine
from .serializers import ChatInputSerializer

from lembretes.models import Lembrete
from contatos.models import Contato
from django.utils import timezone

class ChatAPIView(APIView):
    """
    Endpoint da API para interagir com o ChatEngine.
    """
    permission_classes = [IsAuthenticated] # Exige Token

    # Instancia o engine (ele é leve, só carrega o prompt e o cliente)
    # Poderíamos otimizar isso, mas para o TCC está ótimo.
    chat_engine = ChatEngine()

    def _get_rag_context(self, user, now):
        """
        (Retrieve & Augment)
        Busca dados no banco e formata o contexto para a IA.
        """
        # 1. Retrieve (Recuperar)
        # Busca os próximos 5 lembretes não concluídos
        lembretes = Lembrete.objects.filter(
            usuario=user, 
            concluido=False, 
            data_hora__gte=now
        ).order_by('data_hora')[:5]
        
        # Busca contatos de emergência
        contatos = Contato.objects.filter(usuario=user, is_emergencia=True)

        # 2. Augment (Aumentar)
        context_parts = []
        
        # Adiciona a data/hora atual para a IA saber o "agora"
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
                context_parts.append(f"- Nome: {c.nome}, Telefone: {c.telefone}")

        # Se houver mais do que apenas a data/hora, retorne o contexto
        if len(context_parts) > 1:
            return "\n".join(context_parts)
        
        # Se não houver nada relevante, retorne None
        return None

    def post(self, request, *args, **kwargs):
        # 1. Valida o JSON de entrada (igual antes)
        serializer = ChatInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user_input = serializer.validated_data['mensagem']
        
        # Define o "agora"
        now = timezone.now()

        # 2. Carrega o histórico ANTERIOR (igual antes)
        history_qs = HistoricoChat.objects.filter(usuario=user)
        history_list = [h.to_dict() for h in history_qs]

        # 3. === INÍCIO DA LÓGICA RAG (A NOVIDADE) ===
        # (Retrieve & Augment)
        rag_context = self._get_rag_context(user, now)
        
        if rag_context:
            # Injeta o contexto no histórico.
            # A IA verá isso como uma "dica" do sistema
            # antes de processar a pergunta do usuário.
            history_list.append({
                "role": "system",
                "content": f"--- INÍCIO: CONTEXTO DO USUÁRIO ---\n{rag_context}\n--- FIM: CONTEXTO DO USUÁRIO ---"
            })
        # === FIM DA LÓGICA RAG ===

        try:
            # 4. Envia para a IA (com o histórico + contexto RAG)
            # (Generate)
            answer = self.chat_engine.send_message(user_input, history_list)
        
        except Exception as e:
            return Response(
                {"error": f"Erro ao processar a mensagem: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Salva o par de mensagens (igual antes)
        HistoricoChat.objects.bulk_create([
            HistoricoChat(usuario=user, role='user', content=user_input),
            HistoricoChat(usuario=user, role='assistant', content=answer)
        ])

        # 6. Retorna a resposta da IA (igual antes)
        return Response({"resposta": answer}, status=status.HTTP_200_OK)
        
        # 4. Salva o par de mensagens (pergunta e resposta) no banco
        # (Usamos 'bulk_create' para salvar os dois de uma vez)
        HistoricoChat.objects.bulk_create([
            HistoricoChat(usuario=user, role='user', content=user_input),
            HistoricoChat(usuario=user, role='assistant', content=answer)
        ])

        # 5. Retorna a resposta da IA para o frontend
        return Response({"resposta": answer}, status=status.HTTP_200_OK)