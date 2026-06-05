import sys
import ollama
import json 

main_config = "Seja respeituoso, amigável, não viole leis ou regras e sempre seja divertido e leve."

def main():
    # Agora precisamos de pelo menos o argumento da pergunta (sys.argv[1])
    if len(sys.argv) < 2:
        print("Erro: Nenhuma pergunta enviada.")
        return

    # 1. Pega a pergunta atual de forma isolada
    pergunta = sys.argv[1]
    
    with open("saves.txt", "a", encoding="utf-8") as file:
        file.write(f"\n{pergunta}")

    # 2. Prepara a lista de mensagens começando com a regra do sistema
    lista_mensagens = [
        {"role": "system", "content": main_config}
    ]

    # 3. Se o Node tiver enviado o histórico no segundo argumento, nós adicionamos ele
# 3. Se o Node tiver enviado o histórico no segundo argumento...
    if len(sys.argv) > 2 and sys.argv[2].strip():
        try:
            import base64  # Garanta que o import base64 está no topo do arquivo!
            
            # 1. Pega o Base64 que veio do Node e decodifica para bytes
            dados_decorados = base64.b64decode(sys.argv[2])
            
            # 2. Transforma os bytes de volta em texto string (que é o JSON original)
            string_json = dados_decorados.decode('utf-8')
            
            # 3. Agora sim, transforma a string JSON na lista do Python
            historico_lista = json.loads(string_json)
            
            # 4. Junta as mensagens antigas
            lista_mensagens.extend(historico_lista)
            
        except Exception as err_json:
            # Esse é o aviso que apareceu no seu terminal. Com o código acima, ele vai sumir!
            sys.stderr.write(f"Aviso: Falha ao ler histórico JSON: {err_json}\n")
    # 4. Por fim, adiciona a pergunta atual do usuário no final do histórico
    lista_mensagens.append({"role": "user", "content": pergunta})

    try:
        resposta = ollama.chat(
            model="llama3.2",
            messages=lista_mensagens, # Passa a lista completa e ordenada aqui!
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