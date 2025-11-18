# Guardião da Memória - Backend (API)

Este projeto contém o backend (API) para a solução de tecnologia assistiva "Guardião da Memória", desenvolvida para a disciplina de Interação Humano-Computador (IHC).

O backend é construído em **Django** e **Django Rest Framework (DRF)**, servindo uma API "headless" para o frontend web (React JS).

## Recursos Principais

- **Autenticação:** Sistema de Login/Registro/Logout baseado em Token.
- **CRUDs Seguros:** Endpoints para Lembretes, Contatos (com upload de fotos) e Diário Multimodal (texto, foto, áudio).
- **Chat Inteligente (RAG):** Endpoint de chat (`/api/chat/`) que usa o Llama 3.3 (via Hugging Face) e aplica RAG para buscar lembretes e contatos do usuário em tempo real.

## Como Rodar o Projeto

### 1. Pré-requisitos

- Python 3.10+
- Git

### 2. Configuração do Ambiente

1.  **Repositório:**

    https://github.com/MatheusCastilhos/trabalho-final-ihc-2025/tree/implementacao_em_ia

2.  **Crie e ative um Ambiente Virtual (venv):**

    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\Activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Instale as dependências:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as Variáveis de Ambiente:**
    - Crie um arquivo chamado `.env` na raiz do projeto.
    - Adquira uma chave de API (Hugging Face).
    - O arquivo deve se parecer com isto:
    ```ini
    # .env
    HF_TOKEN=hf_SUA_CHAVE_SECRETA_DO_HUGGING_FACE
    HF_MODEL_ID=meta-llama/Meta-Llama-3-8B-Instruct
    ```

### 3. Execução

1.  **Rode as Migrações** (para criar o banco de dados `db.sqlite3`):

    ```bash
    python manage.py migrate
    ```

2.  **Crie um Superusuário** (para acessar o painel de admin):

    ```bash
    python manage.py createsuperuser
    ```

3.  **Rode o Servidor:**
    ```bash
    python manage.py runserver
    ```

### 4. Links Úteis (Servidor Rodando)

- **Documentação da API (Swagger):** [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
- **Painel de Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
