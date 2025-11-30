# Guardião da Memória — Backend (API)

Este repositório contém o **backend completo** da solução assistiva *Guardião da Memória*, desenvolvida para a disciplina de **Interação Humano-Computador (IHC)**.
A aplicação combina:

* Django + Django REST Framework
* Autenticação por Token
* CRUDs completos (Lembretes, Diário, Contatos)
* Upload de arquivos (imagens/áudios)
* Chat inteligente usando LLaMA 3 via Hugging Face
* RAG interno (extrai lembretes, contatos e diário para contextualizar o modelo)

Ele funciona como **API headless**, consumida pelo frontend em **React**.

---

# 1. Visão Geral da Arquitetura

### Backend (pasta `/backend`)

* Django
* DRF
* DRF Authtoken
* RAG básico interno (sem embeddings)
* API limpa, documentada via Swagger
* Pastas de mídia para fotos/áudios do diário e contatos
* Autenticação via Token (formato `Token xxxxxx`)

### Frontend (pasta `/frontend`)

* React + React Router
* Páginas protegidas
* CRUD de Lembretes, Contatos e Diário
* Chat UI com fluxo de conversa reiniciável
  (O frontend não precisa de setup especial além de apontar para `http://127.0.0.1:8000/api/...`)

---

# 2. Pré-requisitos

* Python 3.10+
* Node 18+ (caso queira rodar o frontend também)
* Git
* Conta e token no **Hugging Face** para usar o modelo

---

# 3. Como rodar o Backend

### 3.1. Clonar o repositório

```bash
git clone https://github.com/MatheusCastilhos/trabalho-final-ihc-2025.git
cd trabalho-final-ihc-2025/backend
```

### 3.2. Criar ambiente virtual

```bash
python -m venv venv
.\venv\Scripts\activate     # Windows
# ou
source venv/bin/activate    # macOS/Linux
```

### 3.3. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3.4. Criar arquivo `.env`

Dentro de `backend/config/.env`:

```
HF_TOKEN=seu_token_do_huggingface
HF_MODEL_ID=meta-llama/Llama-3.2-3B-Instruct
```

> O backend carrega automaticamente esse arquivo via `dotenv`.

### 3.5. Criar o banco do zero

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3.6. Criar superusuário (opcional)

```bash
python manage.py createsuperuser
```

### 3.7. Rodar o servidor

```bash
python manage.py runserver
```

Backend disponível em:

* **API:** [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
* **Swagger:** [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
* **Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

# 4. Endpoints Disponíveis

### **Autenticação**

| Rota                  | Método | Descrição             |
| --------------------- | ------ | --------------------- |
| `/api/auth/register/` | POST   | Registra novo usuário |
| `/api/auth/login/`    | POST   | Retorna token         |
| `/api/auth/logout/`   | POST   | Invalida o token      |

Autenticação é via **Token**:

```
Authorization: Token abc123...
```

---

### **Lembretes**

`/api/lembretes/`

* GET → lista
* POST → cria
* PUT/PATCH → edita
* DELETE → remove
  Model suporta: título, descrição, data/hora, status concluído, tipo do lembrete.

---

### **Diário**

`/api/diario/`

* GET → últimas anotações
* POST → criação (texto/foto/áudio)
* PUT/PATCH/DELETE → edição/remoção

> O RAG usa automaticamente as **últimas 5 entradas** para dar contexto ao modelo.

---

### **Contatos**

`/api/contatos/`

* GET → lista
* POST → cria
* PUT/PATCH → edita
* DELETE → remove
  Inclui campo `is_emergencia`.

> Contatos de emergência entram automaticamente no contexto RAG do chat.

---

### **Chat RAG**

`/api/chat/`

Envia:

```json
{ "message": "Olá, como estou hoje?" }
```

Recebe:

```json
{ "resposta": "..." }
```

O modelo recebe automaticamente:

* Nome do usuário
* Data/hora
* Próximos lembretes
* Contatos de emergência
* Últimas entradas do diário

---

# 5. Como funciona o Chat (RAG integrado)

O fluxo do endpoint `/api/chat/` é:

1. Recebe a mensagem do usuário
2. Carrega o histórico anterior do usuário (do banco)
3. Gera automaticamente um contexto (RAG):

   * Nome do usuário
   * Data/hora atual
   * Próximos lembretes
   * Contatos de emergência
   * Últimas 5 entradas do diário
4. Injeta esse contexto como mensagem `system`
5. Envia tudo para o modelo LLaMA
6. Salva a mensagem do usuário e da IA no banco
7. Retorna a resposta para o frontend

---

# 6. Sobre a Pasta de Mídia (uploads)

Fotos e áudios do Diário/Contatos ficam aqui:

```
backend/media/contato_fotos/
backend/media/diario_fotos/
backend/media/diario_audios/
```

---

# 7. Como rodar o Frontend (opcional)

Se quiser testar o app completo:

```bash
cd ../frontend
npm install
npm start
```

O front abrirá em:

```
http://localhost:3000
```

Certifique-se de que o backend está rodando em:

```
http://127.0.0.1:8000
```

O frontend faz as requisições para `/api/...`.

---

# 8. Fluxo completo para testar o Guardião da Memória

1. **Iniciar backend**
2. **Iniciar frontend**
3. Acessar [http://localhost:3000](http://localhost:3000)
4. Criar conta
5. Fazer login
6. Criar:

   * lembretes
   * contatos (marcar emergências se quiser)
   * anotações de diário
7. Abrir **Assistente**
8. Clicar em “Iniciar conversa”
9. Conversar normalmente — o modelo usa o RAG automaticamente
   (nome, lembretes, contatos, diário)

---

# 9. Estrutura do Projeto

```
backend/
  apps/
    core/         # auth + permissões
    lembretes/    # CRUD de lembretes
    diario/       # diário multimodal
    contatos/     # contatos + emergência
    chat/         # motor da IA + histórico
  config/
    guardiao_backend/
    manage.py
  media/
  requirements.txt
```

---

# 10. Problemas Comuns

### Erro: “HF_TOKEN não encontrado”

→ Criar `.env` dentro de `backend/config/`.

### Chat não responde

→ Verifique se o modelo da HuggingFace está correto e acessível.

### Erro CORS

→ O backend já tem `CORS_ALLOW_ALL_ORIGINS = True`.

### Upload de imagem não funciona

→ Rodar o backend em `DEBUG=True` e garantir que `MEDIA_URL` e `MEDIA_ROOT` estão corretos.

---

# 11. Créditos

Projeto desenvolvido para a disciplina de **IHC (Interação Humano-Computador)**, UFCSPA.
Frontend + Backend integrados, incluindo Chat IA com contexto real do paciente.