from pathlib import Path

def load_prompt(filename: str) -> str:
    """
    Carrega um arquivo de prompt a partir de:
    src/chat/prompts/<filename>

    """
    #Pega a pasta "src"
    base_dir = Path(__file__).resolve().parent.parent

    #Constrói o caminho: src/chat/prompts/<filename>
    prompt_path = base_dir / "chat" / "prompts" / filename

    if not prompt_path.is_file():
        raise FileNotFoundError(f"O arquivo de prompt '{filename}' não foi encontrado em '{prompt_path}'.")
    
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read().strip()