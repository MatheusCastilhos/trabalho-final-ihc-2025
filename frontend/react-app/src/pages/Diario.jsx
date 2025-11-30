import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchDiaryEntries } from "../api/diario";

export default function Diario() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAddNote = () => {
    navigate("/diario/novo");
  };

  // Carregar entradas do diário ao montar a página
  useEffect(() => {
    async function loadDiary() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchDiaryEntries();
        setEntries(data || []);
      } catch (err) {
        setError(err.message || "Erro ao carregar o diário.");
      } finally {
        setLoading(false);
      }
    }

    loadDiary();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";

    return d.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
    });
  };

  // Com a limitação atual, tratamos tudo como texto
  const getEntryTypeLabel = () => {
    return "Texto";
  };

  const getEntryIconClass = () => {
    return "fas fa-file-alt";
  };

  const getEntryDescription = (entry) => {
    if (entry.texto) {
      const txt = entry.texto.trim();
      if (txt.length <= 60) return txt;
      return txt.slice(0, 60) + "...";
    }
    return "Entrada sem descrição.";
  };

  return (
    <div className="container">
      {/* Header geral */}
      <Header />

      {/* MAIN: espaço principal da página */}
      <main className="flex-1 flex flex-col pb-6">
        {/* Cabeçalho da página */}
        <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
          <Link
            to="/dashboard"
            className="text-primary text-2xl mr-3 cursor-pointer"
          >
            <i className="fas fa-arrow-left"></i>
          </Link>

          <h1 className="flex-1 text-center text-2xl font-semibold">
            Meu Diário
          </h1>

          <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow text-primary">
            <i className="fas fa-book"></i>
          </div>
        </header>

        {/* Lista de anotações */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-6">
          {loading && (
            <p className="text-center text-sm text-gray-600">
              Carregando entradas...
            </p>
          )}

          {error && !loading && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && entries.length === 0 && (
            <p className="text-center text-sm text-gray-600">
              Você ainda não tem entradas no diário.
            </p>
          )}

          {!loading &&
            !error &&
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-3xl p-4 shadow-md"
              >
                <div className="font-bold mb-2.5 text-primary text-lg">
                  {formatDate(entry.data_criacao)} — {getEntryTypeLabel()}
                </div>
                <div className="flex items-center">
                  <i
                    className={`${getEntryIconClass()} text-primary mr-3 text-base`}
                  ></i>
                  <p>{getEntryDescription(entry)}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Botão inferior */}
        <button
          onClick={handleAddNote}
          className="
            bg-[#3A5FCD] text-white 
            rounded-lg py-4 w-full 
            text-lg font-semibold shadow-md
          "
        >
          Fazer anotação
        </button>
      </main>
    </div>
  );
}