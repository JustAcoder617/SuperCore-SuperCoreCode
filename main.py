import sys
import ollama
from datetime import datetime
import zoneinfo
import os

# Configuração padrão do SuperCore
main_config = "Seja respeituoso, amigável, não viole leis ou regras e sempre seja divertido e leve. Seu nome é SuperCore."

def set_main_config_of_model(model):
    global main_config
    if model == "llama3.2":
        return
    if model == "qwen2.5-coder:1.5b":
        main_config = "Seja um copiloto, pronto para receber grandes quantias de código bruto de uma vez só, pronto para resolver bugs rápidos, gerar código e ser o professor de uma linguagem específica (caso o usuário pedir)."
    elif model in ["gemma", "gemma:7b", "gemma 4"]: # Adicionado variação que apareceu no seu print
        main_config = "Seja o copiloto do usuário, pronto para receber Muito código, resolver bugs massivos, pensar rápido, resolver questões, checar importações, sugerir comandos de terminal e fazer uma varredura completa no código solicitado."

def main():
    fuso_brasil = zoneinfo.ZoneInfo("America/Sao_Paulo")
    agora_brasil = datetime.now(fuso_brasil)
    data_formatada = agora_brasil.strftime("%d/%m/%Y %H:%M:%S")
    
    if len(sys.argv) < 2:
        print("Erro: Nenhuma pergunta enviada.")
        return
        
    pergunta = sys.argv[1]
    modelo = sys.argv[2] if len(sys.argv) > 2 else "llama3.2"
    ip = sys.argv[3] if len(sys.argv) > 3 else "IP_NAO_DETECTADO"
    
    if modelo:
        modelo = modelo.lower()
    
    set_main_config_of_model(modelo)
    
    lista_mensagens = [
        {"role": "system", "content": main_config},
        {"role": "user", "content": pergunta}
    ]
    
    # Garante que a pasta de logs existe para não dar erro de diretório
    os.makedirs("logs", exist_ok=True)
    
    # Salvando os logs corretamente em modo append ("a")
    with open("logs/logs.txt", "a", encoding="utf-8") as file:
        file.write(f"Novo acesso em {data_formatada}. IP: {ip}\n")
        
    with open("logs/ask.txt", "a", encoding="utf-8") as file:
        file.write(f"Chat do acesso do ip {ip}: {pergunta}\n")
        
    try:
        resposta = ollama.chat(
            model=modelo,
            messages=lista_mensagens,
            options={
                "temperature": 0.56, 
                "num_threads": 2
            }
        )
        
        texto_resposta = resposta["message"]["content"]
        if texto_resposta.lower().startswith("assistant"):
            texto_resposta = texto_resposta[9:].strip()
            
        sys.stdout.write(texto_resposta)
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(f"Erro ao conectar com o Ollama: {e}\n")
        sys.stderr.flush()

if __name__ == "__main__":
    main()