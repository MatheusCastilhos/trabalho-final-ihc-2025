import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { createContact } from "../api/contatos";

export default function NovoContato() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "familia",
    relation: "",
    notes: "",
    isEmergency: false,
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTypeChange = (newType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Por favor, informe o nome do contato.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Por favor, informe o telefone.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Envia somente o que o backend aceita
      await createContact({
        nome: form.name.trim(),
        telefone: form.phone.trim(),
        is_emergencia: form.isEmergency,
      });

      navigate("/contatos");
    } catch (err) {
      setError(err.message || "Erro ao salvar contato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Header />

      <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
        <Link
          to="/contatos"
          className="text-primary text-2xl mr-3 cursor-pointer"
        >
          <i className="fas fa-arrow-left" />
        </Link>

        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Novo contato
        </h1>

        <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow text-primary">
          <i className="fas fa-address-book" />
        </div>
      </header>

      {error && (
        <p className="mb-3 text-center text-sm text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-2 space-y-5">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
            placeholder="Ex.: Maria"
          />
        </div>

        {/* Relação (somente visual) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relação
          </label>
          <input
            type="text"
            name="relation"
            value={form.relation}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base"
            placeholder="Ex.: Filha, Filho, Médico..."
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base"
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Tipo (não vai pro backend, só pra UI mesmo) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de contato
          </label>

          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleTypeChange("familia")}
              className={`flex-1 px-3 py-3 rounded-lg text-sm font-semibold border ${
                form.type === "familia"
                  ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              Família
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("amigo")}
              className={`flex-1 px-3 py-3 rounded-lg text-sm font-semibold border ${
                form.type === "amigo"
                  ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              Amigo
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("medico")}
              className={`flex-1 px-3 py-3 rounded-lg text-sm font-semibold border ${
                form.type === "medico"
                  ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              Médico
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("outro")}
              className={`flex-1 px-3 py-3 rounded-lg text-sm font-semibold border ${
                form.type === "outro"
                  ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              Outro
            </button>
          </div>
        </div>

        {/* Observações (não enviamos pro back, é só UI) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base resize-none"
            placeholder="Ex.: Melhor horário para ligar, cuidados..."
          />
        </div>

        {/* Contato de emergência (vai pro backend) */}
        <div className="pt-1 border-t border-gray-200">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isEmergency"
              checked={form.isEmergency}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-800">
              Marcar como contato de emergência
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-lg bg-[#3A5FCD] text-white text-lg font-semibold shadow-md mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Salvando..." : "Salvar contato"}
        </button>
      </form>
    </div>
  );
}