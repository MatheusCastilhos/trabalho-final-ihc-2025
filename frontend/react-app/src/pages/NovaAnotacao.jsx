import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { createDiaryEntry } from "../api/diario";

export default function NovaAnotacao() {
  const navigate = useNavigate();

  // Referências para os inputs de arquivo ocultos
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    type: "texto", // texto | foto | audio
    title: "",
    textContent: "",
    file: null, // objeto File
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      file: null, // limpa arquivo ao trocar tipo
    }));
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validação básica
    if (form.type === "texto" && !form.textContent.trim()) {
      setError("Por favor, escreva o texto da anotação.");
      return;
    }
    if ((form.type === "foto" || form.type === "audio") && !form.file) {
      setError(`Por favor, selecione um arquivo de ${form.type}.`);
      return;
    }

    try {
      setIsSubmitting(true);

      // Usar FormData para envio de arquivos
      const formData = new FormData();

      // O backend aceita 'texto' para qualquer entrada (como legenda)
      if (form.textContent.trim()) {
        formData.append("texto", form.textContent.trim());
      }

      // Adiciona o arquivo no campo correto esperado pelo Backend (foto ou audio)
      if (form.type === "foto" && form.file) {
        formData.append("foto", form.file);
      } else if (form.type === "audio" && form.file) {
        formData.append("audio", form.file);
      }

      await createDiaryEntry(formData);

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
        {/* Seletor de Tipo */}
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

        {/* Inputs Específicos por Tipo */}

        {/* Caso Texto: Apenas Textarea */}
        {form.type === "texto" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escreva sua memória
            </label>
            <textarea
              name="textContent"
              rows="6"
              value={form.textContent}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base resize-none"
              placeholder="Como foi o seu dia? O que você está sentindo?"
            />
          </div>
        )}

        {/* Caso Foto: Input File + Legenda */}
        {form.type === "foto" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-dashed border-gray-400 text-center">
              <label className="cursor-pointer block">
                <span className="text-primary font-semibold">
                  {form.file ? "Trocar foto" : "Selecionar foto"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {form.file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selecionado: {form.file.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legenda (opcional)
              </label>
              <textarea
                name="textContent"
                rows="3"
                value={form.textContent}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base resize-none"
                placeholder="Quem está na foto? Onde foi?"
              />
            </div>
          </div>
        )}

        {/* Caso Áudio: Input File + Legenda */}
        {form.type === "audio" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-dashed border-gray-400 text-center">
              <label className="cursor-pointer block">
                <span className="text-primary font-semibold">
                  {form.file ? "Trocar áudio" : "Selecionar arquivo de áudio"}
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {form.file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selecionado: {form.file.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do áudio (opcional)
              </label>
              <textarea
                name="textContent"
                rows="3"
                value={form.textContent}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base resize-none"
                placeholder="Sobre o que é este áudio?"
              />
            </div>
          </div>
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
