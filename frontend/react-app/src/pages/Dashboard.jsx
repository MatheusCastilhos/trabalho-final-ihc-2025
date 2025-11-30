import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // aqui depois vamos limpar token e afins
    navigate("/login");
  };

  return (
    <div className="container">
      {/* Header fixo no topo */}
      <Header username="Usuário" onLogout={handleLogout} />

      {/* Área principal: ocupa o resto e centraliza os atalhos */}
      <main className="flex-1 flex items-center justify-center pb-6">
        <div className="grid grid-cols-2 gap-5 w-full max-w-xs">
          <Link
            to="/lembretes"
            className="bg-white rounded-3xl p-5 text-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <i className="fas fa-bell text-4xl text-primary mb-2.5"></i>
            <h2 className="text-xl">Lembretes</h2>
          </Link>

          <Link
            to="/diario"
            className="bg-white rounded-3xl p-5 text-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <i className="fas fa-book-open text-4xl text-primary mb-2.5"></i>
            <h2 className="text-xl">Meu Diário</h2>
          </Link>

          <Link
            to="/assistente"
            className="bg-white rounded-3xl p-5 text-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <i className="fas fa-user-circle text-4xl text-primary mb-2.5"></i>
            <h2 className="text-xl">Assistente</h2>
          </Link>

          <Link
            to="/contatos"
            className="bg-white rounded-3xl p-5 text-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <i className="fas fa-phone text-4xl text-emergency mb-2.5"></i>
            <h2 className="text-xl">Contatos</h2>
          </Link>
        </div>
      </main>
    </div>
  );
}