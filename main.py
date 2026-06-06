import sys
import ollama
# ALTERADO: Importando a classe datetime de dentro do módulo datetime
from datetime import datetime
import zoneinfo

main_config = "Seja respeituoso, amigável, não viole leis ou regras e sempre seja divertido e leve. Seu nome é SuperCore."

def set_main_config_of_model(model):
    global main_config
    if model == "llama3.2":
        return
    if model == "qwen2.5-coder:1.5b":
        main_config = "Seja um copiloto, pronto para receber grandes quantias de código bruto de uma vez só, pronto para resolver bugs rápidos, gerar código e ser o professor de uma linguagem específica (caso o usuário pedir)."
    if model == "gemma" or model == "gemma:7b":
        main_config = "Seja o copiloto do usuário, pronto para receber Muito código, resolver bugs massivos, pensar rápido, resolver questões, checar importações, sugerir commandos de terminal e fazer uma varredura completa no código solicitado."

def main():
    # Agora que usamos 'from datetime import datetime', essa linha funciona perfeitamente:
    fuso_brasil = zoneinfo.ZoneInfo("America/Sao_Paulo")
    agora_brasil = datetime.now(fuso_brasil)
    
    # Adicionando uma quebra de linha (\n) para os logs não ficarem todos colados na mesma linha
    data_formatada = agora_brasil.strftime("%d/%m/%Y %H:%M:%S")
    
    if len(sys.argv) < 2:
        print("Erro: Nenhuma pergunta enviada.")
        return
        
    pergunta = sys.argv[1]
    modelo = sys.argv[2] if len(sys.argv) > 2 else "llama3.2"
    ip = sys.argv[3] if len(sys.argv) > 3 else "IP_NAO_DETECTADO" # Evita quebrar se o Node esquecer de passar o IP
    
    if modelo:
        modelo = modelo.lower()
    
    # Executa a função para atualizar a persona baseada no modelo escolhido
    set_main_config_of_model(modelo)
    
    lista_mensagens = [
        {"role": "system", "content": main_config},
        {"role": "user", "content": pergunta}
    ]
    
    # Gravando o log com quebra de linha no final
    with open("logs.txt", "a") as file:
        file.write(f"Novo acesso em {data_formatada}. IP: {ip}\n")
        
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