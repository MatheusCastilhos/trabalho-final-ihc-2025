import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("As senhas não conferem.");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="container flex flex-col justify-center items-center">
      {/* wrapper largo, ocupando quase a tela toda */}
      <div className="w-full px-6">

        <h1 className="text-3xl font-semibold text-gray-800 mb-10 text-center">
          Criar conta
        </h1>

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
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#3A5FCD] text-white text-lg font-medium shadow-md"
          >
            Registrar
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