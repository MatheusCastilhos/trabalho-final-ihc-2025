import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Diario() {
  const navigate = useNavigate();

  const handleAddNote = () => {
    navigate("/diario/novo");
  };

  return (
    <div className="container">
      {/* Header geral */}
      <Header username="Usuário" />

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
          <div className="bg-white rounded-3xl p-4 shadow-md">
            <div className="font-bold mb-2.5 text-primary text-lg">
              3 de Novembro — Foto
            </div>
            <div className="flex items-center">
              <i className="fas fa-image text-primary mr-3 text-base"></i>
              <p>Foto do almoço em família</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-md">
            <div className="font-bold mb-2.5 text-primary text-lg">
              2 de Novembro — Áudio
            </div>
            <div className="flex items-center">
              <i className="fas fa-volume-up text-primary mr-3 text-base"></i>
              <p>Gravação sobre o passeio no parque</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-md">
            <div className="font-bold mb-2.5 text-primary text-lg">
              1 de Novembro — Texto
            </div>
            <div className="flex items-center">
              <i className="fas fa-file-alt text-primary mr-3 text-base"></i>
              <p>Fragmento do texto escrito...</p>
            </div>
          </div>
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