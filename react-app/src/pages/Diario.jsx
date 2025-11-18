import { Link } from 'react-router-dom';

function Diario() {
  return (
    <div className="container">
      <header className="flex items-center mb-5">
        <Link to="/" className="text-primary text-2xl mr-2.5 cursor-pointer">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="flex-1 text-center text-xl">Meu Diário</h1>
        <div className="bg-primary rounded-full w-10 h-10 flex justify-center items-center text-white">
          <i className="fas fa-book"></i>
        </div>
      </header>
      <div className="mb-5">
        <div className="bg-white rounded-3xl p-4 mb-2.5 shadow-md">
          <div className="font-bold mb-2.5 text-primary">3 de Novembro — Foto</div>
          <i className="fas fa-image text-primary mr-2.5 text-sm"></i>
          <p className="inline">Foto do almoço em família</p>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-2.5 shadow-md">
          <div className="font-bold mb-2.5 text-primary">2 de Novembro — Áudio</div>
          <i className="fas fa-volume-up text-primary mr-2.5 text-sm"></i>
          <p className="inline">Gravação sobre o passeio no parque</p>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-2.5 shadow-md">
          <div className="font-bold mb-2.5 text-primary">1 de Novembro — Texto</div>
          <i className="fas fa-file-alt text-primary mr-2.5 text-sm"></i>
          <p className="inline">Fragmento do texto escrito...</p>
        </div>
      </div>
      <button className="bg-primary text-white border-none rounded-lg p-4 w-full mb-5 cursor-pointer text-base">FAZER ANOTAÇÃO</button>
      <div className="text-center">
        <button className="bg-primary border-none rounded-full w-20 h-20 flex justify-center items-center cursor-pointer mb-2.5 shadow-lg">
          <i className="fas fa-microphone text-white text-xl"></i>
        </button>
        <p className="text-gray-600">Pressione para falar</p>
      </div>
    </div>
  );
}

export default Diario;
