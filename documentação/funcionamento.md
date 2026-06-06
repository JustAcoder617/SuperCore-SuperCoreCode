# Como a IA do SuperCore funciona?
A IA/LLM do SuperCore funciona assim:

* primeiro, no front-end, o usuário faz uma pergunta com um modelo específico.
* Depois, o front-end envia essa mensagem para a o back-end em um formato JSON, com a pergunta e o modelo.
* O back-end envia essa mensagem para um arquivo/executável .py localizado no servidor, onde esse arquivo tem a função de rodar a LLM/IA, processando com a pergunta do usuário enviada pelo back-end.
* O arquivo .py recebe a Resposta da IA/LLM e envia para o Back-end/servidor.
* O servidor recebe a resposta e envia a resposta em um formato JSON para o front-end.
* Por fim, o front-end pega essa resposta, descompacta ela do formato JSON e mostra na tela do usuário.