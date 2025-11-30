import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container flex flex-col justify-center items-center">
      {/* Bloco central que realmente aparece no meio da tela */}
      <div className="w-full max-w-xs text-center">

        <h1 className="text-4xl font-semibold text-gray-900 mb-12">
          Guardião da Memória
        </h1>

        <button
          onClick={() => navigate("/login")}
          className="
            w-full py-4 mb-4
            rounded-xl 
            bg-[#3A5FCD] 
            text-white text-lg font-semibold
            shadow-md
          "
        >
          Entrar
        </button>

        <button
          onClick={() => navigate("/register")}
          className="
            w-full py-4
            rounded-xl 
            bg-white 
            text-[#3A5FCD] 
            border border-[#3A5FCD] 
            text-lg font-semibold
            shadow-sm
          "
        >
          Criar conta
        </button>

      </div>
    </div>
  );
}