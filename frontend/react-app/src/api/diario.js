// src/api/diario.js
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

function getAuthHeaders(isMultipart = false) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const headers = {
    Accept: "application/json",
    Authorization: `Token ${token}`,
  };

  // Se NÃO for multipart (arquivo), mandamos JSON.
  // Se FOR multipart, o navegador define o Content-Type com o boundary sozinho.
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// GET /api/diario/
export async function fetchDiaryEntries() {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/diario/`, {
    method: "GET",
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao carregar entradas do diário."
    );
    throw new Error(errorMessage);
  }

  return data;
}

// POST /api/diario/
// Aceita tanto objeto JSON quanto FormData
export async function createDiaryEntry(payload) {
  const isMultipart = payload instanceof FormData;
  const headers = getAuthHeaders(isMultipart);

  const body = isMultipart ? payload : JSON.stringify(payload);

  const res = await fetch(`${API_URL}/api/diario/`, {
    method: "POST",
    headers,
    body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao criar anotação no diário."
    );
    throw new Error(errorMessage);
  }

  return data;
}

// DELETE /api/diario/:id/
export async function deleteDiaryEntry(id) {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/diario/${id}/`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const errorMessage = extractErrorMessage(data, "Erro ao excluir anotação.");
    throw new Error(errorMessage);
  }

  return true;
}
