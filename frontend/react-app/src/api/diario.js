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

// POST /api/diario/  (somente texto)
export async function createDiaryEntry({ texto }) {
  const baseHeaders = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/diario/`, {
    method: "POST",
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ texto }),
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