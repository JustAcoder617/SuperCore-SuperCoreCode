const env_btn = document.getElementById("env");
// CORRIGIDO: Agora o ID bate com o "response" do HTML
const reponse_entry = document.getElementById("response"); 
let user_to_ia_data = document.getElementById("ask");

async function esperar_resposta_ia(data) {
    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return await response.json();
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

env_btn.addEventListener("click", async () => {
    if (!user_to_ia_data.value.trim()) {
        alert("Digite uma pergunta primeiro!");
        return;
    }

    reponse_entry.innerText = "Pensando...";
    
    const data = {
        content: user_to_ia_data.value,
        model: "qwen2.5-coder:1.5b"
    };

    // CORRIGIDO: Salvando o resultado na variável correta para o IF abaixo
    const resultadoBackEnd = await esperar_resposta_ia(data);

    if (resultadoBackEnd !== "ERROR") {
        reponse_entry.innerText = resultadoBackEnd.message || resultadoBackEnd;
        user_to_ia_data.value = "";
    } else {
        reponse_entry.innerText = "Ocorreu um erro no servidor! Tente Novamente.";
    }
});
