import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import { fetchDiaryEntries, deleteDiaryEntry } from "../api/diario";

export default function Diario() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleAddNote = () => {
    navigate("/diario/novo");
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsModalOpen(false);

    try {
      await deleteDiaryEntry(selectedId);
      setEntries((prev) => prev.filter((e) => e.id !== selectedId));
    } catch (err) {
      alert("Erro ao apagar: " + err.message);
    } finally {
      setSelectedId(null);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchDiaryEntries();
        setEntries(data || []);
      } catch (err) {
        setError(err.message || "Erro ao carregar o diário.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIconClass = (entry) => {
    if (entry.foto) return "fas fa-camera";
    if (entry.audio) return "fas fa-microphone";
    return "fas fa-file-alt";
  };

  const getTypeLabel = (entry) => {
    if (entry.foto) return "Foto";
    if (entry.audio) return "Áudio";
    return "Texto";
  };

  return (
    <div className="container relative">
      <Header />

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Apagar Memória?"
        message="Deseja realmente apagar esta memória do seu diário? Ela será perdida permanentemente."
      />

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
          {loading && <LoadingSpinner />}
          {error && <p className="text-center text-red-600">{error}</p>}

          {!loading && !error && entries.length === 0 && (
            <p className="text-center text-gray-600 py-10">
              Você ainda não tem entradas no diário.
            </p>
          )}

          {!loading &&
            !error &&
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-3xl p-4 shadow-md relative"
              >
                <button
                  onClick={() => confirmDelete(entry.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-2"
                  aria-label="Excluir"
                >
                  <i className="fas fa-trash text-lg"></i>
                </button>

                <div className="flex items-center mb-3">
                  <div className="bg-blue-50 text-primary w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <i className={`${getIconClass(entry)} text-lg`}></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                      {getTypeLabel(entry)}
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {formatDate(entry.data_criacao)}
                    </p>
                  </div>
                </div>

                <div className="mb-1">
                  {entry.foto && (
                    <img
                      src={entry.foto}
                      alt="Memória"
                      className="w-full h-auto rounded-xl mb-3 object-cover shadow-sm"
                    />
                  )}
                  {entry.audio && (
                    <audio
                      controls
                      className="w-full mb-3 rounded-lg bg-gray-50"
                    >
                      <source src={entry.audio} />
                    </audio>
                  )}
                  {entry.texto && (
                    <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap px-1">
                      {entry.texto}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>

        <button
          onClick={handleAddNote}
          className="bg-[#3A5FCD] text-white rounded-lg py-3.5 w-full text-lg font-semibold shadow-md active:scale-[0.98] transition-transform"
        >
          Fazer anotação
        </button>
      </main>
    </div>
  );
}
