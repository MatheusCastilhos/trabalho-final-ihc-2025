import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="container flex flex-col justify-center items-center">
      <div className="w-full max-w-md px-4">

        <h1 className="text-3xl font-semibold text-gray-800 mb-10 text-center">
          Entrar
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Digite seu usuário"
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
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#3A5FCD] text-white text-lg font-medium shadow-md"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Ainda não tem conta?{" "}
          <Link to="/register" className="text-[#3A5FCD] font-medium">
            Criar conta
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