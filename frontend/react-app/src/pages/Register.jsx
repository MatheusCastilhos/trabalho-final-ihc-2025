import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setIsLoading(true);

      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Erro ao registrar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col justify-center items-center">
      <div className="w-full px-6">

        <h1 className="text-3xl font-semibold text-gray-800 mb-10 text-center">
          Criar conta
        </h1>

        {error && (
          <p className="mb-4 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
              placeholder="Digite um nome de usuário"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
              placeholder="Crie uma senha"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar senha
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
              placeholder="Repita a senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#3A5FCD] text-white text-lg font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Já tem conta?{" "}
          <Link to="/login" className="text-[#3A5FCD] font-medium">
            Entrar
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-gray-500">
          <Link to="/" className="underline">
            Voltar para a tela inicial
          </Link>
        </p>
      </div>
    </div>
  );
}