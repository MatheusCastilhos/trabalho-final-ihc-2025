import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lembretes from './pages/Lembretes';
import Diario from './pages/Diario';
import Assistente from './pages/Assistente';
import Contatos from './pages/Contatos';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lembretes" element={<Lembretes />} />
          <Route path="/diario" element={<Diario />} />
          <Route path="/assistente" element={<Assistente />} />
          <Route path="/contatos" element={<Contatos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
