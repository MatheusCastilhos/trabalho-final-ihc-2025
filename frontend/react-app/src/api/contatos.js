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

function getAuthHeaders(isMultipart = false) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const headers = {
    Accept: "application/json",
    Authorization: `Token ${token}`,
  };

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
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

  return data;
}

// GET /api/contatos/:id/
export async function getContact(id) {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/contatos/${id}/`, {
    method: "GET",
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Erro ao buscar contato."));
  }

  return data;
}

// POST /api/contatos/
export async function createContact(payload) {
  const isMultipart = payload instanceof FormData;
  const headers = getAuthHeaders(isMultipart);
  const body = isMultipart ? payload : JSON.stringify(payload);

  const res = await fetch(`${API_URL}/api/contatos/`, {
    method: "POST",
    headers,
    body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(data, "Erro ao criar contato.");
    throw new Error(errorMessage);
  }

  return data;
}

// PATCH /api/contatos/:id/
export async function updateContact(id, payload) {
  const isMultipart = payload instanceof FormData;
  const headers = getAuthHeaders(isMultipart);
  const body = isMultipart ? payload : JSON.stringify(payload);

  const res = await fetch(`${API_URL}/api/contatos/${id}/`, {
    method: "PATCH",
    headers,
    body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Erro ao atualizar contato."
    );
    throw new Error(errorMessage);
  }

  return data;
}

// DELETE /api/contatos/:id/
export async function deleteContact(id) {
  const headers = getAuthHeaders();

  const res = await fetch(`${API_URL}/api/contatos/${id}/`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const errorMessage = extractErrorMessage(data, "Erro ao excluir contato.");
    throw new Error(errorMessage);
  }

  return true;
}
