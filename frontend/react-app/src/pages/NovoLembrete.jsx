import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { createReminder } from "../api/lembretes";

export default function NovoLembrete() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: "",
    time: "",
    title: "",
    type: "medicamento",
    notes: "",
    repeat: false,
    repeatFrequency: "diario",
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

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleFrequencyChange = (freq) => {
    setForm((prev) => ({
      ...prev,
      repeatFrequency: freq,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // validações mínimas
    if (!form.date || !form.time) {
      setError("Por favor, preencha data e horário do lembrete.");
      return;
    }

    if (!form.title.trim()) {
      setError("Por favor, preencha o título do lembrete.");
      return;
    }

    // monta data_hora em formato aceitável pelo Django/DRF
    const data_hora = `${form.date}T${form.time}:00`;

    try {
      setIsSubmitting(true);

      await createReminder({
        titulo: form.title,
        descricao: form.notes || "",
        data_hora,
        tipo: form.type, // <- AQUI: envia o tipo pro backend
      });

      // após salvar com sucesso, volta para lista
      navigate("/lembretes");
    } catch (err) {
      setError(err.message || "Erro ao salvar lembrete.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <Header />

      {/* Topo */}
      <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
        <Link
          to="/lembretes"
          className="text-primary text-2xl mr-3 cursor-pointer"
        >
          <i className="fas fa-arrow-left"></i>
        </Link>

        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Novo lembrete
        </h1>

        <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow text-primary">
          <i className="fas fa-bell"></i>
        </div>
      </header>

      {/* Mensagem de erro */}
      {error && (
        <p className="mb-3 text-center text-sm text-red-600">{error}</p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-2 space-y-5">
        {/* Data + Hora */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
              required
            />
          </div>

          <div className="w-28">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full px-3 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
              required
            />
          </div>
        </div>

        {/* Lembrete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lembrete
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
            placeholder="Ex.: Tomar medicamento da pressão"
            required
          />
        </div>

        {/* Tipo — botões */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>

          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleTypeChange("medicamento")}
              className={`
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold border
                ${
                  form.type === "medicamento"
                    ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                    : "bg-white text-gray-800 border-gray-300"
                }
              `}
            >
              Medicamento
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("refeicao")}
              className={`
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold border
                ${
                  form.type === "refeicao"
                    ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                    : "bg-white text-gray-800 border-gray-300"
                }
              `}
            >
              Refeição
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("consulta")}
              className={`
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold border
                ${
                  form.type === "consulta"
                    ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                    : "bg-white text-gray-800 border-gray-300"
                }
              `}
            >
              Consulta
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("outro")}
              className={`
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold border
                ${
                  form.type === "outro"
                    ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                    : "bg-white text-gray-800 border-gray-300"
                }
              `}
            >
              Outro
            </button>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD] resize-none"
            placeholder="Ex.: Tomar com água, antes do café da manhã."
          />
        </div>

        {/* Repetição (apenas UI por enquanto) */}
        <div className="pt-1 border-t border-gray-200">
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              name="repeat"
              checked={form.repeat}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-800">
              Repetir lembrete (opcional)
            </span>
          </label>

          {form.repeat && (
            <div className="ml-2 mt-1 space-y-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Frequência
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFrequencyChange("diario")}
                  className={`
                    flex-1 py-2 rounded-lg text-sm font-semibold border
                    ${
                      form.repeatFrequency === "diario"
                        ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                        : "bg-white text-gray-800 border-gray-300"
                    }
                  `}
                >
                  Diário
                </button>

                <button
                  type="button"
                  onClick={() => handleFrequencyChange("semanal")}
                  className={`
                    flex-1 py-2 rounded-lg text-sm font-semibold border
                    ${
                      form.repeatFrequency === "semanal"
                        ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                        : "bg-white text-gray-800 border-gray-300"
                    }
                  `}
                >
                  Semanal
                </button>

                <button
                  type="button"
                  onClick={() => handleFrequencyChange("mensal")}
                  className={`
                    flex-1 py-2 rounded-lg text-sm font-semibold border
                    ${
                      form.repeatFrequency === "mensal"
                        ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                        : "bg-white text-gray-800 border-gray-300"
                    }
                  `}
                >
                  Mensal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botão Final */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-lg bg-[#3A5FCD] text-white text-lg font-semibold shadow-md mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Salvando..." : "Salvar lembrete"}
        </button>
      </form>
    </div>
  );
}