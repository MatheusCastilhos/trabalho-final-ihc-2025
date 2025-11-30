import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { createDiaryEntry } from "../api/diario";

export default function NovaAnotacao() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "texto",
    title: "",
    textContent: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
    }));
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.type !== "texto") {
      setError("Esta função ainda não está disponível.");
      return;
    }

    if (!form.textContent.trim()) {
      setError("Por favor, escreva o texto da anotação.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createDiaryEntry({
        texto: form.textContent.trim(),
      });

      navigate("/diario");
    } catch (err) {
      setError(err.message || "Erro ao salvar anotação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Header />

      <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
        <Link
          to="/diario"
          className="text-primary text-2xl mr-2.5 cursor-pointer"
        >
          <i className="fas fa-arrow-left"></i>
        </Link>

        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Nova anotação
        </h1>

        <div className="bg-white rounded-full w-10 h-10 flex justify-center items-center shadow text-primary">
          <i className="fas fa-book"></i>
        </div>
      </header>

      {error && (
        <p className="mb-3 text-center text-sm text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 mt-2">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de anotação
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("texto")}
              className={`
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold border
                ${
                  form.type === "texto"
                    ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                    : "bg-white text-gray-800 border-gray-300"
                }
              `}
            >
              Texto
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("foto")}
              className={`
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold border
                ${
                  form.type === "foto"
                    ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                    : "bg-white text-gray-800 border-gray-300"
                }
              `}
            >
              Foto
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("audio")}
              className={`
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold border
                ${
                  form.type === "audio"
                    ? "bg-[#3A5FCD] text-white border-[#3A5FCD]"
                    : "bg-white text-gray-800 border-gray-300"
                }
              `}
            >
              Áudio
            </button>
          </div>
        </div>

        {/* Título (só visual por enquanto) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base"
            placeholder="Ex.: Almoço em família"
          />
        </div>

        {/* Conteúdo */}
        {form.type === "texto" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto
            </label>
            <textarea
              name="textContent"
              rows="4"
              value={form.textContent}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base resize-none"
              placeholder="Escreva aqui sua anotação..."
            />
          </div>
        ) : (
          <p className="text-center text-sm text-gray-600">
            Esta função ainda não está disponível.
          </p>
        )}

        {/* Botão final */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg bg-[#3A5FCD] text-white text-base font-medium shadow-md mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Salvando..." : "Salvar anotação"}
        </button>
      </form>
    </div>
  );
}