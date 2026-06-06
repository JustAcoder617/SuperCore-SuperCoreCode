import sys
import ollama

main_config = "Seja respeituoso, amigável, não viole leis ou regras e sempre seja divertido e leve. Seu nome é SuperCore."
def set_main_config_of_model(model):
    global main_config
    if  model=="llama3.2":
        return
    if model=="qwen2.5-coder:1.5b":
        main_config="Seja um copiloto, pronto para receber grandes quantias de código bruto de uma vez só, pronto para resolver bugs rápidos, gerar código e ser o professor de uma linguagem específica (caso o usuário pedir)."
    if model=="gemma" or model=="gemma:7b":
        main_config="Seja o copiloto do usuário, pronto para receber Muito código, resolver bugs massivos, pensar rápido, resolver questões, checar importações, sugerir commandos de terminal e fazer uma varredura completa no código solicitado."
def main():
    if len(sys.argv) < 2:
        print("Erro: Nenhuma pergunta enviada.")
        return

    pergunta = sys.argv[1]
    modelo = sys.argv[2] if len(sys.argv) > 2 else "llama3.2"
    
    if modelo:
        modelo = modelo.lower()
    
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