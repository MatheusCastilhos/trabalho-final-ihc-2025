import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchContacts } from "../api/contatos";

function Contatos() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAddContact = () => {
    navigate("/contatos/novo");
  };

  useEffect(() => {
    async function loadContacts() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchContacts();
        setContacts(data || []);
      } catch (err) {
        setError(err.message || "Erro ao carregar contatos.");
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

  // Ícone baseado no tipo — por enquanto sempre fa-user, mas no futuro pode vir do back
  const getContactIcon = (contato) => {
    // COMO o backend não salva "tipo", deixamos apenas o comportamento desejado:
    // médico usando ícone de médico se o nome indicar "Dr", "Dra"
    const nome = contato.nome.toLowerCase();

    if (nome.startsWith("dr ") || nome.startsWith("dr.") || nome.startsWith("dra"))
      return "fas fa-user-md";

    return "fas fa-user";
  };

  return (
    <div className="container">
      <Header />

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

      <div className="mb-6">
        <h3 className="mb-4 text-primary font-semibold text-lg">
          Contatos Rápidos
        </h3>

        {loading && (
          <p className="text-center text-sm text-gray-600">
            Carregando contatos...
          </p>
        )}

        {error && !loading && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && contacts.length === 0 && (
          <p className="text-center text-sm text-gray-600">
            Você ainda não tem contatos cadastrados.
          </p>
        )}

        {!loading &&
          !error &&
          contacts.map((contato) => (
            <div
              key={contato.id}
              className="bg-white rounded-3xl p-4 mb-3 flex items-center shadow-sm border border-gray-100"
            >
              {/* Ícone redondo */}
              <div
                className="
                  rounded-full w-12 h-12 flex justify-center items-center shadow mr-4
                  bg-[#DCE6FF] text-primary
                "
              >
                <i className={getContactIcon(contato)} />
              </div>

              {/* Nome + Telefone */}
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-gray-900">{contato.nome}</p>

                  {/* Estrelinha da emergência */}
                  {contato.is_emergencia && (
                    <span className="text-yellow-500 text-sm">⭐</span>
                  )}
                </div>

                <p className="text-sm text-gray-600">{contato.telefone}</p>
              </div>

              {/* Botão de chamada */}
              <button
                type="button"
                className="bg-[#3A5FCD] border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer text-white shadow-md"
              >
                <i className="fas fa-phone" />
              </button>
            </div>
          ))}
      </div>

      <button
        onClick={handleAddContact}
        className="bg-[#3A5FCD] text-white border-none rounded-lg py-3 w-full cursor-pointer text-base font-medium shadow-md"
      >
        Adicionar Contato
      </button>
    </div>
  );
}

export default Contatos;