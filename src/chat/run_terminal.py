from src.chat.engine import ChatEngine


def main() -> None:
    print("=" * 80)
    print("  Guardião da Memória – Assistente de Conversa (protótipo IHC)")
    print("  Digite sua mensagem e aperte Enter.")
    print("  Para encerrar, digite: sair")
    print("=" * 80)

    # Inicializa o motor de conversa
    engine = ChatEngine()

    while True:
        try:
            user_input = input("\nVocê: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n\nEncerrando conversa. Até logo!")
            break

        if not user_input:
            print("Pode escrever algo ou digitar 'sair' para encerrar.")
            continue

        if user_input.lower() in {"sair", "exit", "quit"}:
            print("Encerrando conversa. Até logo!")
            break

        try:
            answer = engine.send_message(user_input)
        except Exception as e:
            print(f"\n[ERRO] Problema ao falar com o modelo: {e}")
            continue

        print("\nGuardião:", answer)


if __name__ == "__main__":
    main()