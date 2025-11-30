import { useNavigate } from "react-router-dom";

export default function Header({ username = "Usuário", onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    else navigate("/");
  };

  return (
    <div
      className="
        flex justify-between items-center
        mb-8
        pt-6 pb-4
        px-2
        rounded-xl
      "
      style={{
        marginTop: "10px",
      }}
    >
      {/* Saudação */}
      <div className="leading-tight">
        <p className="text-base text-gray-700">Bem-vindo,</p>
        <p className="text-2xl font-semibold text-gray-900">
          {username}
        </p>
      </div>

      {/* Botão sair (maior, mais legível, mais tocável) */}
      <button
        onClick={handleLogout}
        className="
          px-4 py-2
          rounded-full 
          border border-gray-300 
          text-sm font-semibold
          text-gray-700
          bg-white
          shadow-md
          active:scale-[0.97]
          transition-transform
        "
      >
        Sair
      </button>
    </div>
  );
}