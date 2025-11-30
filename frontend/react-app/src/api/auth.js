const API_URL = "http://127.0.0.1:8000"; // depois, se quiser, joga isso num .env

function extractErrorMessage(data, fallback) {
  if (!data) return fallback;

  // DRF às vezes manda { detail: "..." }
  if (typeof data.detail === "string") return data.detail;

  // Às vezes manda { username: ["já existe"], email: ["inválido"], ... }
  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const value = data[firstKey];

      if (Array.isArray(value) && value.length > 0) return value[0];
      if (typeof value === "string") return value;
    }
  }

  // Último recurso
  if (typeof data === "string") return data;

  return fallback;
}

export async function registerUser({ username, email, password }) {
  const res = await fetch(`${API_URL}/api/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = extractErrorMessage(data, "Erro ao registrar");
    throw new Error(errorMessage);
  }

  // deve conter token, user_id, email, etc.
  return data;
}

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

  if (!res.ok) {
    const errorMessage = extractErrorMessage(
      data,
      "Usuário ou senha inválidos"
    );
    throw new Error(errorMessage);
  }

  // deve conter token e possivelmente dados do usuário
  return data;
}

export async function logoutUser() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    // já está "deslogado" do ponto de vista do front
    return;
  }

  try {
    await fetch(`${API_URL}/api/auth/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },
    });
  } catch (e) {
    // se der erro no fetch, a gente só loga no console
    console.error("Erro ao chamar logout:", e);
  }
}