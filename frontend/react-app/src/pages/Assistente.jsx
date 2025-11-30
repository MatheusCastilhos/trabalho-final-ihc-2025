import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { sendChatMessage } from "../api/chat";

function Assistente() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);

  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // sempre rolar para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleStartChat = async () => {
    setError("");
    setIsStarting(true);

    try {
      // Mensagem "interna" para o modelo iniciar a conversa
      const initialPrompt =
        "Inicie a conversa se apresentando de forma acolhedora ao paciente. " +
        "Explique brevemente como você pode ajudar com memória e rotinas, em linguagem simples.";

      const resposta = await sendChatMessage(initialPrompt);

      setMessages([
        {
          id: 1,
          sender: "bot",
          text: resposta,
        },
      ]);
      setChatStarted(true);
    } catch (err) {
      setError(
        err.message ||
          "Não foi possível iniciar a conversa. Tente novamente em alguns instantes."
      );
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const text = message.trim();
    if (!text) return;
    if (!chatStarted) return;

    // adiciona mensagem do usuário na tela
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        text,
      },
    ]);
    setMessage("");

    try {
      setIsSending(true);

      const resposta = await sendChatMessage(text);

      // adiciona resposta do bot
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "bot",
          text: resposta,
        },
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Não foi possível obter resposta do assistente. Tente novamente."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleBack = () => {
    // Encerrar sessão: limpa mensagens e estado
    setMessages([]);
    setChatStarted(false);
    setMessage("");
    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="container">
      {/* Header geral (Bem-vindo, Usuário / Sair) */}
      <Header />

      {/* MAIN ocupa o restante da tela */}
      <main className="flex-1 flex flex-col">
        {/* Cabeçalho da página + linha divisória */}
        <header className="mb-4 pb-3 flex items-center border-b border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            className="text-primary text-2xl mr-3 cursor-pointer"
          >
            <i className="fas fa-arrow-left"></i>
          </button>

          <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
            Assistente
          </h1>

          <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow text-primary">
            <i className="fas fa-user-circle"></i>
          </div>
        </header>

        {/* Mensagem de erro geral */}
        {error && (
          <p className="mb-2 text-center text-sm text-red-600">{error}</p>
        )}

        {/* Área de chat */}
        <section className="flex-1 flex flex-col">
          {/* Lista de mensagens ou estado inicial */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
            {!chatStarted && !isStarting && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-700 px-4">
                <p className="text-base mb-2">
                  Quando estiver pronto, toque no botão abaixo para iniciar a
                  conversa com o Guardião da Memória.
                </p>
                <p className="text-sm text-gray-500">
                  A conversa é reiniciada sempre que você sair desta tela.
                </p>
              </div>
            )}

            {isStarting && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-700 px-4">
                <p className="text-base mb-1">Iniciando conversa...</p>
                <p className="text-sm text-gray-500">
                  Aguarde um instante enquanto o assistente se prepara.
                </p>
              </div>
            )}

            {chatStarted &&
              messages.map((msg) => (
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

          {/* Barra inferior */}
          {!chatStarted && !isStarting ? (
            // Botão para iniciar a conversa
            <div className="pb-6">
              <button
                type="button"
                onClick={handleStartChat}
                disabled={isStarting}
                className="w-full py-3 rounded-lg bg-[#3A5FCD] text-white text-base font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Iniciar conversa
              </button>
            </div>
          ) : chatStarted ? (
            // Campo de entrada de mensagem
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 mt-auto pb-6"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isSending
                    ? "Aguardando resposta..."
                    : "Digite sua mensagem..."
                }
                disabled={isSending}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD] disabled:bg-gray-100 disabled:text-gray-500"
              />
              <button
                type="submit"
                aria-label="Enviar mensagem"
                disabled={isSending}
                className="w-12 h-12 rounded-full bg-[#3A5FCD] text-white flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <i className="fas fa-paper-plane text-sm" />
              </button>
            </form>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default Assistente;