import { Link } from 'react-router-dom';

function Contatos() {
  return (
    <div className="container">
      <header className="flex items-center mb-5">
        <Link to="/" className="text-primary text-2xl mr-2.5 cursor-pointer">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="flex-1 text-center text-xl">Contatos</h1>
        <div className="bg-primary rounded-full w-10 h-10 flex justify-center items-center text-white">
          <i className="fas fa-address-book"></i>
        </div>
      </header>
      <div className="bg-emergency text-white rounded-3xl p-5 text-center mb-5 shadow-lg">
        <i className="fas fa-exclamation-triangle text-4xl mb-2.5"></i>
        <h2 className="text-xl">BOTÃO DE EMERGÊNCIA</h2>
      </div>
      <div className="mb-5">
        <h3 className="mb-2.5 text-primary">Contatos Rápidos</h3>
        <div className="bg-white rounded-3xl p-4 mb-2.5 flex items-center shadow-md">
          <div className="bg-primary rounded-full w-12.5 h-12.5 flex justify-center items-center text-white mr-4">
            <i className="fas fa-user"></i>
          </div>
          <div className="flex-1">
            <p className="font-bold">Maria (filha)</p>
            <p className="text-sm">(11) 99999-9999</p>
          </div>
          <button className="bg-primary border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer text-white">
            <i className="fas fa-phone"></i>
          </button>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-2.5 flex items-center shadow-md">
          <div className="bg-primary rounded-full w-12.5 h-12.5 flex justify-center items-center text-white mr-4">
            <i className="fas fa-user"></i>
          </div>
          <div className="flex-1">
            <p className="font-bold">João (filho)</p>
            <p className="text-sm">(11) 99999-9999</p>
          </div>
          <button className="bg-primary border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer text-white">
            <i className="fas fa-phone"></i>
          </button>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-2.5 flex items-center shadow-md">
          <div className="bg-primary rounded-full w-12.5 h-12.5 flex justify-center items-center text-white mr-4">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="flex-1">
            <p className="font-bold">Dr. Silva</p>
            <p className="text-sm">Cardiologista</p>
          </div>
          <button className="bg-primary border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer text-white">
            <i className="fas fa-phone"></i>
          </button>
        </div>
      </div>
      <div className="text-center">
        <button className="bg-primary text-white border-none rounded-lg p-4 w-full mb-5 cursor-pointer text-base">Adicionar Contato</button>
        <button className="bg-primary border-none rounded-full w-20 h-20 flex justify-center items-center cursor-pointer shadow-lg">
          <i className="fas fa-microphone text-white text-xl"></i>
        </button>
      </div>
    </div>
  );
}

export default Contatos;
