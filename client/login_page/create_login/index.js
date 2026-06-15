import { true_fetch } from "/dist/readyfetch.js";

const env_btn = document.getElementById("env");
const username_input = document.getElementById("usr");
const password_input = document.getElementById("psw");
const error_div = document.getElementById("error-container");

function set_err(type) {
    if (!error_div) return;

    let text = "";
    switch (type) {
        case "s": text = "Erro interno no servidor ou resposta inválida."; break;
        case "l": text = "Esse usuário já existe ou dados inválidos."; break;
        case "c": text = "Erro de conexão. Verifique sua internet."; break;
        default: text = "";
    }

    error_div.innerText = text;
}

function red_page() {
    window.location.href = "../../index.html";
}

async function send_to_back(data) {
    set_err("");

    try {
        const response = await true_fetch("/login/create", data, true, true);

        if (!response || !response.message) {
            return set_err("s");
        }
        if (response.message === "Usuário já cadastrado" || response.message === "Dados inválidos") {
            return set_err("l");
        }

        if (response.message === "Cadastro efetuado com sucesso!" || response.message === "Login efetuado com sucesso!") {
            red_page();
        }
    } catch (err) {
        if (err.message && (err.message.includes("400") || err.message.includes("401"))) {
            return set_err("l");
        }
        console.error("Erro no cadastro:", err);
        set_err("c");
    }
}

env_btn.addEventListener("click", async () => {
    if (env_btn.disabled) return;

    const user = username_input.value.trim();
    const password = password_input.value;

    if (!user || !password) {
        error_div.innerText = "Por favor, preencha todos os campos.";
        return;
    }

    env_btn.disabled = true;
    env_btn.innerText = "Cadastrando...";

    await send_to_back({ user, password });

    env_btn.disabled = false;
    env_btn.innerText = "Enviar dados";
});