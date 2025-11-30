// src/api/lembretes.js
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

// LISTAR lembretes do usuário logado
export async function fetchReminders() {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/lembretes/`, {
    method: "GET",
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao carregar lembretes."
    );
    throw new Error(errorMessage);
  }

  return data; // lista de lembretes
}

// BUSCAR um lembrete específico (para edição)
export async function getReminder(id) {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/lembretes/${id}/`, {
    method: "GET",
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Erro ao buscar lembrete."));
  }

  return data;
}

// CRIAR novo lembrete
export async function createReminder({ titulo, descricao, data_hora, tipo }) {
  const baseHeaders = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/lembretes/`, {
    method: "POST",
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo,
      descricao,
      data_hora,
      tipo,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(data, "Erro ao criar lembrete.");
    throw new Error(errorMessage);
  }

  return data;
}

// ATUALIZAR lembrete existente
export async function updateReminder(
  id,
  { titulo, descricao, data_hora, tipo }
) {
  const baseHeaders = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/lembretes/${id}/`, {
    method: "PATCH", // ou PUT
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo,
      descricao,
      data_hora,
      tipo,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao atualizar lembrete."
    );
    throw new Error(errorMessage);
  }

  return data;
}

// DELETAR lembrete
export async function deleteReminder(id) {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/lembretes/${id}/`, {
    method: "DELETE",
    headers,
  });

  // DELETE geralmente retorna 204 No Content, sem corpo JSON
  if (!res.ok) {
    // Tenta ler json de erro, se houver
    const data = await res.json().catch(() => null);
    const errorMessage = extractErrorMessage(data, "Erro ao excluir lembrete.");
    throw new Error(errorMessage);
  }

  return true;
}
