import sys
import ollama

main_config = "Seja respeituoso, amigável, não viole leis ou regras e sempre seja divertido e leve. Seu nome é SuperCore."

def main():
    if len(sys.argv) < 2:
        print("Erro: Nenhuma pergunta enviada.")
        return

    # Captura os dois argumentos diretos enviados pelo Node
    pergunta = sys.argv[1]
    modelo = sys.argv[2] if len(sys.argv) > 2 else "llama3.2"
    
    if modelo:
        modelo = modelo.lower()

    # Prepara o envio contendo apenas as diretrizes do sistema e a pergunta atual
    lista_mensagens = [
        {"role": "system", "content": main_config},
        {"role": "user", "content": pergunta}
    ]

    try:
        resposta = ollama.chat(
            model=modelo,
            messages=lista_mensagens,
            options={
                "temperature": 1.0,
                "num_threads": 2
            }
        )
        
        texto_resposta = resposta["message"]["content"]
        
        if texto_resposta.lower().startswith("assistant"):
            texto_resposta = texto_resposta[9:].strip()
            
        sys.stdout.write(texto_resposta)
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(f"Erro ao conectar com o Ollama: {e}")
        sys.stderr.flush()

if __name__ == "__main__":
    main()