import { useState, useEffect, useRef } from "react";

export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [hasSupport, setHasSupport] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Verifica suporte ao carregar
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSupport(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false; // Define se mostra o texto enquanto fala ou só o final
    recognition.maxAlternatives = 1;

    // Eventos
    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Permissão de microfone negada. Verifique as configurações do navegador."
        );
      } else if (event.error === "no-speech") {
        setError("Não escutei nada. Tente novamente.");
      } else {
        setError("Erro ao escutar. Tente novamente.");
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || !hasSupport) return;
    try {
      setTranscript(""); // Limpa anterior
      recognitionRef.current.start();
    } catch (e) {
      // Ignora erro se já estiver rodando
      console.log("Reconhecimento já iniciado ou erro:", e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  return {
    isListening,
    transcript,
    error,
    hasSupport,
    startListening,
    stopListening,
    setTranscript, // Exportamos para poder limpar o texto manualmente após enviar
  };
}
