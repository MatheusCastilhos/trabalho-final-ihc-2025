from typing import List, Dict
import os
from pathlib import Path

from huggingface_hub import InferenceClient
from dotenv import load_dotenv

from .utils import load_prompt

Message = Dict[str, str]


class ChatEngine:
    """
    Motor de conversa com o modelo Llama via Hugging Face.
    """

    def __init__(
        self,
        model_id: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 400,
    ) -> None:
        # Tenta carregar o .env de várias formas para garantir
        # 1. Do diretório atual
        load_dotenv()
        
        # 2. Do diretório config explicitamente (para garantir no Windows/Caminhos complexos)
        # Caminho: backend/apps/chat/engine.py -> sobe 3 níveis -> backend/config/.env
        base_dir = Path(__file__).resolve().parent.parent.parent
        config_env = base_dir / "config" / ".env"
        if config_env.exists():
            load_dotenv(config_env)

        hf_token = os.getenv("HF_TOKEN")
        env_model_id = os.getenv("HF_MODEL_ID")

        if not hf_token:
            # Mensagem de erro mais descritiva
            raise RuntimeError(
                f"HF_TOKEN não encontrado. Verifique se o arquivo existe em: {config_env}"
            )

        self.model_id = model_id or env_model_id
        if not self.model_id:
            raise RuntimeError(
                "HF_MODEL_ID não encontrado no .env e nenhum model_id foi passado."
            )

        self.client = InferenceClient(
            model=self.model_id,
            token=hf_token,
        )

        self.system_prompt: str = load_prompt("system_prompt.txt")
        self.history: List[Message] = []
        self.temperature = temperature
        self.max_tokens = max_tokens

    def reset_history(self) -> None:
        self.history.clear()

    def _build_messages(self, new_user_message: str, history: List[Message]) -> List[Message]:
        messages: List[Message] = [
            {"role": "system", "content": self.system_prompt}
        ]
        messages.extend(history)
        messages.append({"role": "user", "content": new_user_message})
        return messages

    def send_message(self, user_input: str, history: List[Message]) -> str:
        messages = self._build_messages(user_input, history)

        response = self.client.chat_completion(
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )

        answer = response.choices[0].message["content"].strip()
        return answer