import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

export default function NovaAnotacao() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    time: "",
    type: "texto",
    title: "",
    textContent: "",
    photoFile: null,
    audioFile: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: files && files.length > 0 ? files[0] : null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTypeChange = (newType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // aqui no futuro vamos chamar o backend (POST /api/diario/)
    console.log("Nova anotação do diário (apenas front por enquanto):", form);

    // por enquanto, só volta para a lista do diário
    navigate("/diario");
  };

  return (
    <div className="container">
      {/* Header geral */}
      <Header username="Usuário" />

      {/* Cabeçalho da página */}
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

      {/* Formulário (igual estrutura do NovoLembrete) */}
      <form onSubmit={handleSubmit} className="space-y-5 mt-2">
        {/* Data + horário */}
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
            />
          </div>
        </div>

        {/* Tipo de anotação – botões (sem overflow esquisito) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de anotação
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("texto")}
              className={`
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold
                border
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
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold
                border
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
                flex-1 px-3 py-3 rounded-lg text-sm font-semibold
                border
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

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
            placeholder="Ex.: Almoço em família"
          />
        </div>

        {/* Conteúdo dependendo do tipo */}
        {form.type === "texto" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto
            </label>
            <textarea
              name="textContent"
              rows="4"
              value={form.textContent}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD] resize-none"
              placeholder="Escreva aqui sua lembrança, pensamento ou anotação..."
            />
          </div>
        )}

        {form.type === "foto" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto
            </label>
            <input
              type="file"
              name="photoFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm text-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500">
              Selecione uma foto relacionada a este momento.
            </p>
          </div>
        )}

        {form.type === "audio" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Áudio
            </label>
            <input
              type="file"
              name="audioFile"
              accept="audio/*"
              onChange={handleChange}
              className="w-full text-sm text-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500">
              Se tiver uma gravação, você pode anexar o arquivo de áudio aqui.
            </p>
          </div>
        )}

        {/* Botão final */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#3A5FCD] text-white text-base font-medium shadow-md mt-2"
        >
          Salvar anotação
        </button>
      </form>
    </div>
  );
}