// src/api/chat.js
const API_URL = "http://127.0.0.1:8000";

function extractErrorMessage(data, fallback) {
  if (!data) return fallback;

  if (typeof data.detail === "string") return data.detail;

  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const value = data[firstKey];

      if (Array.isArray(value) && value.length > 0) return value[0];
      if (typeof value === "string") return value;
    }
  }

  if (typeof data === "string") return data;

  return fallback;
}

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
}

// BUSCAR HISTÓRICO (GET)
export async function fetchChatHistory() {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/chat/`, {
    method: "GET",
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao carregar histórico."
    );
    throw new Error(errorMessage);
  }

  return data; // Lista de mensagens [{role, content, ...}]
}

// ENVIAR MENSAGEM (POST)
export async function sendChatMessage(message) {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/chat/`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao enviar mensagem para o assistente."
    );
    throw new Error(errorMessage);
  }

  // backend retorna { "resposta": "..." }
  return data.resposta;
}
