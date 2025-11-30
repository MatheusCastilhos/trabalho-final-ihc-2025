import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import { fetchContacts, deleteContact } from "../api/contatos";

function Contatos() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleAddContact = () => navigate("/contatos/novo");
  const handleEditContact = (id) => navigate(`/contatos/${id}`);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async () => {
    if (!selectedId) return;
    setIsModalOpen(false);

    try {
      await deleteContact(selectedId);
      setContacts((prev) => prev.filter((c) => c.id !== selectedId));
    } catch (err) {
      alert(err.message || "Erro ao excluir contato.");
    } finally {
      setSelectedId(null);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchContacts();
        setContacts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container relative">
      <Header />

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteContact}
        title="Excluir Contato?"
        message="Tem certeza que deseja apagar este contato? Ele será removido da sua lista."
      />

      <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
        <Link
          to="/dashboard"
          className="text-primary text-2xl mr-3 cursor-pointer"
        >
          <i className="fas fa-arrow-left" />
        </Link>
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Contatos
        </h1>
        <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow text-primary">
          <i className="fas fa-address-book" />
        </div>
      </header>

      <div className="bg-[#FDE2E2] text-[#C53030] rounded-3xl p-6 text-center mb-6 shadow-md border border-[#F7CACA]">
        <i className="fas fa-exclamation-triangle text-5xl mb-3" />
        <h2 className="text-lg font-semibold tracking-wide">
          BOTÃO DE EMERGÊNCIA
        </h2>
      </div>

      <div className="mb-6 flex-1">
        <h3 className="mb-4 text-primary font-semibold text-lg">
          Contatos Rápidos
        </h3>

        {loading && <LoadingSpinner />}
        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        {!loading && !error && contacts.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Nenhum contato cadastrado.
          </p>
        )}

        {!loading &&
          !error &&
          contacts.map((contato) => (
            <div
              key={contato.id}
              className="bg-white rounded-3xl p-4 mb-3 flex items-center shadow-sm border border-gray-100"
            >
              <div className="rounded-full w-12 h-12 flex justify-center items-center shadow mr-4 bg-[#DCE6FF] overflow-hidden shrink-0">
                {contato.foto ? (
                  <img
                    src={contato.foto}
                    alt={contato.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {contato.nome}
                  </p>
                  {contato.is_emergencia && (
                    <span className="text-yellow-500 text-sm">⭐</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{contato.telefone}</p>
              </div>

              <div className="flex gap-2 ml-2 items-center shrink-0">
                <button className="bg-[#3A5FCD] border-none rounded-full w-9 h-9 flex justify-center items-center text-white shadow-md active:scale-95">
                  <i className="fas fa-phone text-xs" />
                </button>
                <button
                  onClick={() => handleEditContact(contato.id)}
                  className="text-gray-400 hover:text-primary text-lg px-2"
                >
                  <i className="fas fa-pen" />
                </button>
                <button
                  onClick={() => confirmDelete(contato.id)}
                  className="text-gray-400 hover:text-red-600 text-lg px-2"
                >
                  <i className="fas fa-trash" />
                </button>
              </div>
            </div>
          ))}
      </div>

      <button
        onClick={handleAddContact}
        className="bg-[#3A5FCD] text-white border-none rounded-lg py-3.5 w-full cursor-pointer text-lg font-semibold shadow-md active:scale-[0.98] transition-transform"
      >
        Adicionar Contato
      </button>
    </div>
  );
}

export default Contatos;
