const button_env = document.getElementById("enviar");
const campo_pergunta = document.getElementById("ask");

// 1. Busca o histórico local
function obterHistoricoLocal() {
    try {
        const historicoSalvo = localStorage.getItem("historico_chat");
        return historicoSalvo ? JSON.parse(historicoSalvo) : [];
    } catch (e) {
        console.error("Erro ao ler LocalStorage:", e);
        return [];
    }
}

// 2. Salva novos blocos de mensagem no histórico local
function salvarNoHistoricoLocal(role, content) {
    const historico = obterHistoricoLocal();
    historico.push({ role: role, content: content });
    
    // Mantém as últimas 10 mensagens para manter o contexto leve
    if (historico.length > 10) {
        historico.shift(); 
    }
    localStorage.setItem("historico_chat", JSON.stringify(historico));
}

async function wait_for_ia_reponse(perguntaAtual) {
    document.getElementById("response").innerHTML = `Pensando...`;
    
    const historicoCompleto = obterHistoricoLocal();

    // Objeto formatado de forma limpa para o Node receber
    const dadosParaEnviar = {
        content: perguntaAtual,
        historico: historicoCompleto
    };

    try {
        let response = await fetch('/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosParaEnviar)
        });
        
        if (response.ok) {
            const dadosResposta = await response.json();
            const respostaTexto = dadosResposta.message;
            
            document.getElementById("response").innerText = respostaTexto;
            
            // Registra a interação atual no histórico
            salvarNoHistoricoLocal("user", perguntaAtual);
            salvarNoHistoricoLocal("assistant", respostaTexto);
            
        } else {
            document.getElementById("response").innerText = "Desculpe, mas ocorreu um erro no servidor.";
        }
    } catch(err) {
        console.error(err);
        document.getElementById("response").innerText = "Erro de conexão com o servidor.";
    }
}

button_env.addEventListener("click", async () => {
    const pergunta = campo_pergunta.value.trim();
    
    if (pergunta !== "") {
        await wait_for_ia_reponse(pergunta);
        campo_pergunta.value = ""; 
    }
});