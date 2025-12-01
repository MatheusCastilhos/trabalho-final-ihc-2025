// src/api/auth.js
const API_URL = "http://127.0.0.1:8000"; // se mudar porta, ajusta aqui

function extractErrorMessage(data, fallback) {
  if (!data) return fallback;

  // DRF às vezes manda {detail: "..."}
  if (typeof data.detail === "string") return data.detail;

  // Às vezes manda {username: ["já existe"], email: ["inválido"]...}
  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const value = data[firstKey];
    if (Array.isArray(value)) return value[0];
    if (typeof value === "string") return value;
  }

  // Último recurso
  if (typeof data === "string") return data;

  return fallback;
}

// REGISTRO
export async function registerUser({
  username,
  email,
  password,
  fullName,
  birthDate,
}) {
  const res = await fetch(`${API_URL}/api/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      // campos extras esperados pelo backend
      nome_completo: fullName,
      data_nascimento: birthDate, // "YYYY-MM-DD"
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(data, "Erro ao registrar");
    throw new Error(errorMessage);
  }

  return data; // pode conter token, etc.
}

// LOGIN
export async function loginUser({ username, password }) {
  const res = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => null);
  console.log("LOGIN RESPONSE:", data);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Usuário ou senha inválidos"
    );
    throw new Error(errorMessage);
  }

  return data; // { token, user_id, email, username, ... }
}

// LOGOUT
export async function logoutUser() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return;
  }

  const res = await fetch(`${API_URL}/api/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    console.error("Erro ao fazer logout no backend:", data);
  }
}