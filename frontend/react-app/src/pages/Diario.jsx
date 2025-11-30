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

  // evita pegar timezone errado
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return dateString.slice(11, 16); // pega HH:MM direto
  };

  return (
    <div className="container">
      <Header />

      <main className="flex-1 flex flex-col pb-6">
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
                  {formatDate(entry.data_criacao)} — {formatTime(entry.data_criacao)}
                </div>

                <div className="flex items-start">
                  <i className="fas fa-file-alt text-primary mr-3 text-base mt-1"></i>
                  <p className="whitespace-pre-line text-gray-800">
                    {entry.texto || "Entrada vazia."}
                  </p>
                </div>
              </div>
            ))}
        </div>

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