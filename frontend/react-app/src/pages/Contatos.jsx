import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Contatos() {
  const navigate = useNavigate();

  const handleAddContact = () => {
    navigate("/contatos/novo");
  };

  return (
    <div className="container">
      {/* Header geral */}
      <Header username="Usuário" />

      {/* Cabeçalho da página */}
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

      {/* Botão de emergência */}
      <div className="bg-[#FDE2E2] text-[#C53030] rounded-3xl p-6 text-center mb-6 shadow-md border border-[#F7CACA]">
        <i className="fas fa-exclamation-triangle text-5xl mb-3" />
        <h2 className="text-lg font-semibold tracking-wide">
          BOTÃO DE EMERGÊNCIA
        </h2>
      </div>

      {/* Lista de contatos rápidos */}
      <div className="mb-6">
        <h3 className="mb-4 text-primary font-semibold text-lg">
          Contatos Rápidos
        </h3>

        <div className="bg-white rounded-3xl p-4 mb-3 flex items-center shadow-sm border border-gray-100">
          <div className="bg-[#DCE6FF] rounded-full w-12 h-12 flex justify-center items-center text-primary mr-4 shadow">
            <i className="fas fa-user" />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900">Maria (filha)</p>
            <p className="text-sm text-gray-600">(11) 99999-9999</p>
          </div>

          <button
            type="button"
            className="bg-[#3A5FCD] border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer text-white shadow-md"
          >
            <i className="fas fa-phone" />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-4 mb-3 flex items-center shadow-sm border border-gray-100">
          <div className="bg-[#DCE6FF] rounded-full w-12 h-12 flex justify-center items-center text-primary mr-4 shadow">
            <i className="fas fa-user" />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900">João (filho)</p>
            <p className="text-sm text-gray-600">(11) 99999-9999</p>
          </div>

          <button
            type="button"
            className="bg-[#3A5FCD] border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer text-white shadow-md"
          >
            <i className="fas fa-phone" />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-4 mb-3 flex items-center shadow-sm border border-gray-100">
          <div className="bg-[#DCE6FF] rounded-full w-12 h-12 flex justify-center items-center text-primary mr-4 shadow">
            <i className="fas fa-user-md" />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900">Dr. Silva</p>
            <p className="text-sm text-gray-600">Cardiologista</p>
          </div>

          <button
            type="button"
            className="bg-[#3A5FCD] border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer text-white shadow-md"
          >
            <i className="fas fa-phone" />
          </button>
        </div>
      </div>

      {/* Botão para adicionar contato */}
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