import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { sendChatMessage, fetchChatHistory } from "../api/chat";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

function Assistente() {
  const navigate = useNavigate();

  // Estados do Chat
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState("");

  const messagesEndRef = useRef(null);

  // Hook de Voz (Nossa nova implementação)
  const {
    isListening,
    transcript: voiceText,
    error: voiceError,
    hasSupport,
    startListening,
    setTranscript,
  } = useSpeechRecognition();

  // Efeito para atualizar o input quando a voz for reconhecida
  useEffect(() => {
    if (voiceText) {
      setMessage((prev) => (prev ? prev + " " + voiceText : voiceText));
      // Opcional: Limpar o transcript do hook para não duplicar se falar de novo
      // mas o hook já limpa no startListening.
    }
  }, [voiceText]);

  // Carregar Histórico
  useEffect(() => {
    async function loadHistory() {
      try {
        setIsLoadingHistory(true);
        const historyData = await fetchChatHistory();

        if (historyData && historyData.length > 0) {
          const formattedMessages = historyData.map((msg) => ({
            id: msg.id,
            sender: msg.role === "user" ? "user" : "bot",
            text: msg.content,
          }));
          setMessages(formattedMessages);
          setChatStarted(true);
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  // Scroll automático
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Falar (TTS)
  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    window.speechSynthesis.speak(utterance);
  };

  const handleStartChat = () => {
    setChatStarted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChatError("");
    const text = message.trim();
    if (!text) return;

    // Adiciona msg do usuário
    const tempId = Date.now();
    setMessages((prev) => [...prev, { id: tempId, sender: "user", text }]);
    setMessage("");
    setTranscript(""); // Limpa o buffer de voz se houver

    try {
      setIsSending(true);
      const resposta = await sendChatMessage(text);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: resposta },
      ]);
      speakResponse(resposta);
    } catch (err) {
      setChatError("Erro ao obter resposta. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  const handleBack = () => {
    window.speechSynthesis.cancel();
    navigate("/dashboard");
  };

  // Combina erros de chat e voz para exibir
  const displayError = chatError || voiceError;

  return (
    <div className="container h-screen flex flex-col bg-[#faf7e6]">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden pb-4">
        <header className="mb-2 pb-2 flex items-center border-b border-gray-200">
          <button onClick={handleBack} className="text-primary text-2xl mr-3">
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
            Assistente
          </h1>
          <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow text-primary">
            <i className="fas fa-user-circle"></i>
          </div>
        </header>

        {displayError && (
          <p className="mb-2 text-center text-sm text-red-600 bg-red-50 p-2 rounded">
            {displayError}
          </p>
        )}

        <section className="flex-1 flex flex-col overflow-hidden relative">
          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-24">
            {isLoadingHistory && (
              <div className="text-center text-gray-500 mt-10">
                <i className="fas fa-spinner fa-spin mr-2"></i> Carregando...
              </div>
            )}

            {!isLoadingHistory && !chatStarted && messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-700 px-4">
                <i className="fas fa-robot text-6xl text-gray-300 mb-4"></i>
                <p className="text-lg mb-4 font-medium">
                  Olá! Sou o Guardião da Memória.
                </p>
                <button
                  onClick={handleStartChat}
                  className="px-6 py-3 bg-[#3A5FCD] text-white rounded-xl shadow-md font-semibold"
                >
                  Iniciar Conversa
                </button>
              </div>
            )}

            {(chatStarted || messages.length > 0) &&
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-[#3A5FCD] text-white flex items-center justify-center text-xs mr-2 shadow shrink-0">
                      <i className="fas fa-user-nurse" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm max-w-[80%] text-base leading-snug ${
                      msg.sender === "user"
                        ? "bg-[#3A5FCD] text-white rounded-br-sm"
                        : "bg-white text-gray-900 rounded-bl-sm border border-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

            {isSending && (
              <div className="flex justify-start animate-pulse ml-10">
                <div className="bg-gray-200 px-4 py-2 rounded-full text-xs text-gray-500">
                  Digitando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Fixo no Rodapé */}
          {(chatStarted || messages.length > 0) && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#faf7e6] pt-2 pb-2 px-1">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {/* Botão de Voz */}
                {hasSupport && (
                  <button
                    type="button"
                    onClick={startListening}
                    disabled={isListening || isSending}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300
                      ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse scale-110 ring-4 ring-red-200"
                          : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
                      }
                    `}
                    title="Falar"
                  >
                    <i
                      className={`fas ${
                        isListening ? "fa-microphone-slash" : "fa-microphone"
                      }`}
                    ></i>
                  </button>
                )}

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isListening ? "Ouvindo você..." : "Digite sua mensagem..."
                  }
                  disabled={isSending}
                  className={`
                    flex-1 px-4 py-3 rounded-full border bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]
                    ${isListening ? "border-red-400" : "border-gray-300"}
                  `}
                />

                <button
                  type="submit"
                  disabled={isSending || !message.trim()}
                  className="w-12 h-12 rounded-full bg-[#3A5FCD] text-white flex items-center justify-center shadow-md disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-paper-plane text-sm" />
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Assistente;
