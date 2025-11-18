import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="grid grid-cols-2 gap-5 mb-10">
        <Link to="/lembretes" className="bg-white rounded-3xl p-5 text-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <i className="fas fa-bell text-4xl text-primary mb-2.5"></i>
          <h2 className="text-xl">Lembretes</h2>
        </Link>
        <Link to="/diario" className="bg-white rounded-3xl p-5 text-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <i className="fas fa-book-open text-4xl text-primary mb-2.5"></i>
          <h2 className="text-xl">Meu Diário</h2>
        </Link>
        <Link to="/assistente" className="bg-white rounded-3xl p-5 text-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <i className="fas fa-user-circle text-4xl text-primary mb-2.5"></i>
          <h2 className="text-xl">Assistente</h2>
        </Link>
        <Link to="/contatos" className="bg-white rounded-3xl p-5 text-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <i className="fas fa-phone text-4xl text-emergency mb-2.5"></i>
          <h2 className="text-xl">Contatos</h2>
        </Link>
      </div>
      <div className="text-center">
        <button className="bg-primary border-none rounded-full w-20 h-20 flex justify-center items-center cursor-pointer mb-2.5 shadow-lg">
          <i className="fas fa-microphone text-white text-xl"></i>
        </button>
        <p className="text-gray-600">Pressione para falar</p>
      </div>
    </div>
  );
}

export default Home;
