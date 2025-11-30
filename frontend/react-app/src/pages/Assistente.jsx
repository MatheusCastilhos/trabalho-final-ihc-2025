import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function Assistente() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Olá! Como posso ajudar você hoje?",
    },
    {
      id: 2,
      sender: "bot",
      text: "Em breve, esta tela será o seu chat com o Guardião da Memória.",
    },
  ]);

  const messagesEndRef = useRef(null);

  // sempre rolar para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        text,
      },
      {
        id: prev.length + 2,
        sender: "bot",
        text: "Entendi. Na próxima etapa, vou responder usando a inteligência artificial.",
      },
    ]);

    setMessage("");
  };

  return (
    <div className="container">
      {/* Header geral (Bem-vindo, Usuário / Sair) */}
      <Header username="Usuário" />

      {/* MAIN ocupa o restante da tela */}
      <main className="flex-1 flex flex-col">
        {/* Cabeçalho da página + linha divisória */}
        <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
          <Link
            to="/dashboard"
            className="text-primary text-2xl mr-3 cursor-pointer"
          >
            <i className="fas fa-arrow-left"></i>
          </Link>

          <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
            Assistente
          </h1>

          <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow text-primary">
            <i className="fas fa-user-circle"></i>
          </div>
        </header>

        {/* Área de chat */}
        <section className="flex-1 flex flex-col">
          {/* Lista de mensagens */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-9 h-9 rounded-full bg-[#3A5FCD] text-white flex items-center justify-center text-sm mr-2 shadow-md">
                    <i className="fas fa-user-nurse" />
                  </div>
                )}

                <div
                  className={`px-4 py-3 rounded-2xl shadow-md max-w-[75%] text-base leading-snug ${
                    msg.sender === "user"
                      ? "bg-[#3A5FCD] text-white rounded-br-sm"
                      : "bg-white text-gray-900 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs ml-2">
                    <i className="fas fa-user" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Campo de entrada de mensagem */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 mt-auto pb-6"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
            />
            <button
              type="submit"
              aria-label="Enviar mensagem"
              className="w-12 h-12 rounded-full bg-[#3A5FCD] text-white flex items-center justify-center shadow-md"
            >
              <i className="fas fa-paper-plane text-sm" />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Assistente;