from typing import List, Dict
import os

from huggingface_hub import InferenceClient
from dotenv import load_dotenv

from src.utils.loader import load_prompt

Message = Dict[str, str]


class ChatEngine:
    """
    Motor de conversa com o modelo Llama via Hugging Face.

    Responsabilidades:
    - Carregar o system prompt.
    - Inicializar o cliente da HF.
    - Manter o histórico da conversa (user/assistant).
    - Enviar mensagens para o modelo e devolver a resposta em texto.
    """

    def __init__(
        self,
        model_id: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 400,
    ) -> None:
        # Carrega variáveis do .env
        load_dotenv()

        hf_token = os.getenv("HF_TOKEN")
        env_model_id = os.getenv("HF_MODEL_ID")

        if not hf_token:
            raise RuntimeError("HF_TOKEN não encontrado no .env")

        self.model_id = model_id or env_model_id
        if not self.model_id:
            raise RuntimeError("HF_MODEL_ID não encontrado no .env e nenhum model_id foi passado.")

        # Inicializa client da HF
        self.client = InferenceClient(
            model=self.model_id,
            token=hf_token,
        )

        # Carrega o system prompt a partir do arquivo .txt
        self.system_prompt: str = load_prompt("system_prompt.txt")

        # Histórico da conversa (apenas user/assistant; system fica separado)
        self.history: List[Message] = []

        # Parâmetros de geração
        self.temperature = temperature
        self.max_tokens = max_tokens

    def reset_history(self) -> None:
        """Limpa o histórico da conversa (sem mexer no system prompt)."""
        self.history.clear()

    def _build_messages(self, new_user_message: str) -> List[Message]:
        """
        Monta a lista de mensagens no formato esperado pelo chat_completion.
        Coloca o system prompt primeiro, depois o histórico, depois a nova mensagem do usuário.
        """
        messages: List[Message] = [
            {"role": "system", "content": self.system_prompt}
        ]

        # Adiciona histórico prévio (user/assistant)
        messages.extend(self.history)

        # Adiciona nova mensagem do usuário
        messages.append({"role": "user", "content": new_user_message})

        return messages

    def send_message(self, user_input: str) -> str:
        """
        Recebe o texto do usuário, envia para o modelo e devolve a resposta.
        Também atualiza o histórico interno.
        """
        messages = self._build_messages(user_input)

        # Chamada ao modelo via Hugging Face
        response = self.client.chat_completion(
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )

        # Extrai o texto da resposta
        answer = response.choices[0].message["content"].strip()

        # Atualiza histórico com o par user/assistant
        self.history.append({"role": "user", "content": user_input})
        self.history.append({"role": "assistant", "content": answer})

        return answer