import sys
import ollama
from datetime import datetime
import zoneinfo
import os

def main():
    # Configuração de fuso horário e data para os logs
    fuso_brasil = zoneinfo.ZoneInfo("America/Sao_Paulo")
    agora_brasil = datetime.now(fuso_brasil)
    data_formatada = agora_brasil.strftime("%d/%m/%Y %H:%M:%S")
    
    if len(sys.argv) < 2:
        sys.stderr.write("Erro: Nenhuma pergunta enviada.\n")
        return
        
    pergunta = sys.argv[1]
    modelo_recebido = sys.argv[2].lower() if len(sys.argv) > 2 else "llama3.2"
    ip = sys.argv[3] if len(sys.argv) > 3 else "IP_NAO_DETECTADO"
    
    # 🌟 MAPEAMENTO DOS SEUS MODELOS CUSTOMIZADOS DO OLLAMA
    # Se o Node pedir o Llama original para o teste gratuito ou o Gemma, usamos seu supercore-assistant
    if modelo_recebido in ["llama3.2", "gemma2", "supercore-assistant"]:
        modelo_final = "supercore-assistant"
    # Se o Node pedir o deepseek ou qualquer variação de código, jogamos para o seu supercorecode
    elif "deepseek" in modelo_recebido or "code" in modelo_recebido or "qwen" in modelo_recebido:
        modelo_final = "supercorecode"
    else:
        # Fallback de segurança caso chegue algo totalmente inesperado
        modelo_final = "supercore-assistant"
    
    # Monta a lista de mensagens. O "system prompt" não é mais necessário aqui
    # porque ele já foi embutido direto no manifesto de cada modelo via Modelfile!
    lista_mensagens = [
        {"role": "user", "content": pergunta}
    ]
    
    # Garante que a pasta de logs existe
    os.makedirs("logs", exist_ok=True)
    
    # Salvando os logs mantendo o seu padrão exato
    with open("logs/logs.txt", "a", encoding="utf-8") as file:
        file.write(f"Novo acesso em {data_formatada}. IP: {ip} | Modelo Usado: {modelo_final}\n")
        
    with open("logs/ask.txt", "a", encoding="utf-8") as file:
        file.write(f"Chat do acesso do ip {ip}: {pergunta}\n")
        
    try:
        # Faz a chamada ao Ollama usando o modelo mapeado
        # Nota: As opções de 'temperature' e 'num_threads' já estão salvas no modelo,
        # mas mantivemos o num_threads=2 aqui caso queira forçar o limite de CPU do servidor.
        resposta = ollama.chat(
            model=modelo_final,
            messages=lista_mensagens,
            options={
                "num_threads": 2
            }
        )
        
        texto_resposta = resposta["message"]["content"]
        
        # Tratamento de segurança caso o modelo repita a tag do papel
        if texto_resposta.lower().startswith("assistant"):
            texto_resposta = texto_resposta[9:].strip()
            
        sys.stdout.write(texto_resposta)
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(f"Erro ao conectar com o Ollama: {e}\n")
        sys.stderr.flush()

if __name__ == "__main__":
    main()