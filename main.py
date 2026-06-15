import sys
import ollama
from datetime import datetime
import zoneinfo
import os

def main():
    fuso_brasil = zoneinfo.ZoneInfo("America/Sao_Paulo")
    agora_brasil = datetime.now(fuso_brasil)
    data_formatada = agora_brasil.strftime("%d/%m/%Y %H:%M:%S")
    
    if len(sys.argv) < 2:
        sys.stderr.write("Erro: Nenhuma pergunta enviada.\n")
        return
        
    pergunta = sys.argv[1]
    modelo_recebido = sys.argv[2].lower() if len(sys.argv) > 2 else "llama3.2"
    ip = sys.argv[3] if len(sys.argv) > 3 else "IP_NAO_DETECTADO"
    
    if modelo_recebido in ["llama3.2", "gemma2", "supercore-assistant"]:
        modelo_final = "supercore"
    elif "deepseek" in modelo_recebido or "code" in modelo_recebido or "qwen" in modelo_recebido:
        modelo_final = "supercorecode"
    else:
        modelo_final = "supercore"
    
    lista_mensagens = [
        {"role": "user", "content": pergunta}
    ]
    
    os.makedirs("logs", exist_ok=True)

    with open("logs/logs.txt", "a", encoding="utf-8") as file:
        file.write(f"Novo acesso em {data_formatada}. IP: {ip} | Modelo Usado: {modelo_final}\n")
        
    with open("logs/ask.txt", "a", encoding="utf-8") as file:
        file.write(f"Chat do acesso do ip {ip}: {pergunta}\n")
        
    try:
        resposta = ollama.chat(
            model=modelo_final,
            messages=lista_mensagens,
            options={
                "num_threads": 2
            }
        )
        
        texto_resposta = resposta["message"]["content"]
        
            
        sys.stdout.write(texto_resposta)
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(f"Erro ao conectar com o Ollama: {e}\n")
        sys.stderr.flush()

if __name__ == "__main__":
    main()