import sys
import ollama
import time as tm
main_config="Seja respeituoso, amígavel, não viole leis ou regras e sempre seja divertido e leve."
def main():
    if len(sys.argv) < 2:
        print("Erro: Nenhuma pergunta enviada.")
        return
    pergunta = " ".join(sys.argv[1:])
    historico= " ".join(sys.argv[2:])
    with open("saves.txt", "a", encoding="utf-8") as file:
        file.write(f"\n{pergunta}")
    try:
        
        resposta = ollama.chat(
            model="llama3.2",
            messages=[
                {"role": "user", "content": pergunta},
                {"role": "system", "content": main_config}
            ],
            options={
                "temperature":1.0,
                "num_threads": 2
            }
        )
        texto_resposta = resposta["message"]["content"]
        if texto_resposta.lower().startswith("assistant"):
            texto_resposta=texto_resposta[9:].strip()
        sys.stdout.write(texto_resposta)
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(f"Erro ao conectar com o Ollama: {e}")
        sys.stderr.flush()

if __name__ == "__main__":
    main()