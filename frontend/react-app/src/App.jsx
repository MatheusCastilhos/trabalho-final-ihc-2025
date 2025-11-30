import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Lembretes from "./pages/Lembretes";
import NovoLembrete from "./pages/NovoLembrete";

import Diario from "./pages/Diario";
import NovaAnotacao from "./pages/NovaAnotacao";

import Assistente from "./pages/Assistente";

import Contatos from "./pages/Contatos";
import NovoContato from "./pages/NovoContato";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Tela inicial (não logado) */}
          <Route path="/" element={<Home />} />

          {/* Autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Área logada */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Lembretes */}
          <Route path="/lembretes" element={<Lembretes />} />
          <Route path="/lembretes/novo" element={<NovoLembrete />} />

          {/* Diário */}
          <Route path="/diario" element={<Diario />} />
          <Route path="/diario/novo" element={<NovaAnotacao />} />

          {/* Assistente */}
          <Route path="/assistente" element={<Assistente />} />

          {/* Contatos */}
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/contatos/novo" element={<NovoContato />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;