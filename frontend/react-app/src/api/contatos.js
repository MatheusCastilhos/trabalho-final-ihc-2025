// src/api/contatos.js
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
    Authorization: `Token ${token}`,
  };
}

// GET /api/contatos/
export async function fetchContacts() {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/contatos/`, {
    method: "GET",
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao carregar contatos."
    );
    throw new Error(errorMessage);
  }

  return data; // lista de contatos
}

// POST /api/contatos/  (vamos usar depois no NovoContato)
export async function createContact({ nome, telefone, is_emergencia = false }) {
  const baseHeaders = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/contatos/`, {
    method: "POST",
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      telefone,
      is_emergencia,
      // foto fica de fora por enquanto
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao criar contato."
    );
    throw new Error(errorMessage);
  }

  return data;
}