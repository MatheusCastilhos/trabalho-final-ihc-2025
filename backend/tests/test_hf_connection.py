from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os


def main():
    # Carrega variáveis do .env
    load_dotenv()
    hf_token = os.getenv("HF_TOKEN")
    model_id = os.getenv("HF_MODEL_ID")

    if not hf_token:
        raise RuntimeError("HF_TOKEN não encontrado no .env")

    # Cria o client para esse modelo
    client = InferenceClient(
        model=model_id,
        token=hf_token,
    )

    # Mensagem simples só pra teste
    messages = [
        {
            "role": "user",
            "content": "Olá! Responda em português em uma frase curta: quem é você?"
        }
    ]

    print("Enviando requisição para o modelo, aguarde...\n")

    # Chamada ao endpoint de chat (API unificada da HF)
    response = client.chat_completion(
        messages=messages,
        max_tokens=128,
        temperature=0.3,
    )

    answer = response.choices[0].message["content"]
    print("Resposta do modelo:\n")
    print(answer)


if __name__ == "__main__":
    main()