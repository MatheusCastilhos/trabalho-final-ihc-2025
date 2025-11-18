import { Link } from 'react-router-dom';

function Lembretes() {
  return (
    <div className="container">
      <header className="flex items-center mb-5">
        <Link to="/" className="text-primary text-2xl mr-2.5 cursor-pointer">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="flex-1 text-center text-xl">Meus Lembretes</h1>
        <div className="bg-primary rounded-full w-10 h-10 flex justify-center items-center text-white">
          <i className="fas fa-calendar-alt"></i>
        </div>
      </header>
      <div className="mb-10">
        <div className="bg-white rounded-3xl p-4 mb-2.5 flex items-center shadow-md relative">
          <i className="fas fa-pills text-primary mr-4 text-xl"></i>
          <div className="flex-1">
            <p>08:00 – Tomar medicamento da pressão</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-2.5 flex items-center shadow-md relative">
          <i className="fas fa-utensils text-primary mr-4 text-xl"></i>
          <div className="flex-1">
            <p>12:00 – Almoço</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-2.5 flex items-center shadow-md relative">
          <i className="fas fa-pills text-primary mr-4 text-xl"></i>
          <div className="flex-1">
            <p>14:30 – Tomar medicamento para diabetes</p>
          </div>
          <button className="absolute right-4 bg-primary text-white border-none rounded-lg px-2.5 py-1 cursor-pointer">AGORA</button>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-2.5 flex items-center shadow-md relative">
          <i className="fas fa-utensils text-primary mr-4 text-xl"></i>
          <div className="flex-1">
            <p>18:00 – Jantar</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-2.5 flex items-center shadow-md relative">
          <i className="fas fa-user-md text-primary mr-4 text-xl"></i>
          <div className="flex-1">
            <p>15:00 – Consulta com Dr. Silva</p>
          </div>
        </div>
      </div>
      <div className="text-center">
        <button className="bg-primary text-white border-none rounded-lg p-4 w-full mb-5 cursor-pointer text-base">Adicionar Lembrete</button>
        <button className="bg-primary border-none rounded-full w-20 h-20 flex justify-center items-center cursor-pointer shadow-lg">
          <i className="fas fa-microphone text-white text-xl"></i>
        </button>
      </div>
    </div>
  );
}

export default Lembretes;
