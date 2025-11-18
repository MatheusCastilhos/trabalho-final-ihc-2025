import { Link } from 'react-router-dom';

function Assistente() {
  return (
    <div className="container">
      <header className="flex items-center mb-5">
        <Link to="/" className="text-primary text-2xl mr-2.5 cursor-pointer">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="flex-1 text-center text-xl">Assistente</h1>
        <div className="bg-primary rounded-full w-10 h-10 flex justify-center items-center text-white">
          <i className="fas fa-user-circle"></i>
        </div>
      </header>
      <div className="bg-white rounded-3xl p-5 mb-10 shadow-md text-center">
        <p className="text-base">Olá! Como posso ajudar você hoje?</p>
      </div>
      <div className="text-center mb-5">
        <button className="bg-primary border-none rounded-full w-30 h-30 flex justify-center items-center cursor-pointer shadow-lg">
          <i className="fas fa-microphone text-white text-3xl"></i>
        </button>
      </div>
      <div className="text-center text-gray-600">
        <p>Aperte para falar. Você pode pedir para o assistente abrir qualquer área do app.</p>
      </div>
    </div>
  );
}

export default Assistente;
