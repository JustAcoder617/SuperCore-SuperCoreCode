const button_env = document.getElementById("enviar");
const campo_pergunta = document.getElementById("ask");

const dadosParaEnviar = {
    content: "",
    model: ""
};

async function wait_for_ia_reponse(perguntaAtual) {
    document.getElementById("response").innerHTML = `Pensando...`;

    dadosParaEnviar.content = perguntaAtual;
    dadosParaEnviar.model = get_model_ia_use();

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
            document.getElementById("response").innerText = dadosResposta.message;
        } else {
            document.getElementById("response").innerText = "Desculpe, mas ocorreu um erro no servidor.";
        }
    } catch(err) {
        console.error(err);
        document.getElementById("response").innerText = "Erro de conexão com o servidor.";
    }
}

let checkboxes = document.querySelectorAll("input[name=option]");
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            checkboxes.forEach(outroCheckbox => {
                if (outroCheckbox !== this) {
                    outroCheckbox.checked = false;
                }
            });
        }
    });
});

function get_model_ia_use(){
    const olm_3_2 = document.getElementById("3.2");
    const gemma4 = document.getElementById("gemma4");
    const deep_seek = document.getElementById("ds1");

    if (olm_3_2 && olm_3_2.checked) return "llama3.2";
    if (gemma4 && gemma4.checked) return "gemma4";
    if (deep_seek && deep_seek.checked) return "deepseek-r1";
    
    return null; 
}

button_env.addEventListener("click", async () => {
    const pergunta = campo_pergunta.value.trim();
    
    if (pergunta !== "") {
        await wait_for_ia_reponse(pergunta);
        campo_pergunta.value = ""; 
    }
});
//NOTA IMPORTANTE: como dito do main.js server-side, eu vou (adm) estudar sql. Quando eu aprender, ai sim vai sair o pro e o login.
