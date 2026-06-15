import { true_fetch } from "/dist/readyfetch.js";

const env_btn = document.getElementById("env");
const username_input = document.getElementById("usr");
const password_input = document.getElementById("psw");
const error_div = document.getElementById("error-container");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function set_err(type) {
    if (!error_div) return;
    let text = "";
    switch (type) {
        case "s": text = "Erro interno no servidor ou resposta inválida."; break;
        case "l": text = "Usuário ou senha incorretos."; break;
        case "c": text = "Erro de conexão. Verifique sua internet."; break;
        default: text = "";
    }
    error_div.innerText = text;
}

async function set_button(estado) {
    const textoOriginal = "Enviar dados";
    set_err("");

    if (estado === 1) {
        env_btn.style.boxShadow = "5px 5px 5px green";
        env_btn.style.backgroundColor = "green";
        env_btn.style.color = "white";
        env_btn.innerText = "Login realizado com sucesso!";
        await sleep(1500);
        window.location.href = "../index.html";
        return;
    }

    if (estado === 2) {
        env_btn.style.boxShadow = "5px 5px 5px yellow";
        env_btn.style.backgroundColor = "yellow";
        env_btn.style.color = "black";
        env_btn.innerText = "Usuário ou senha incorretos!";
        set_err("l");
        await sleep(2000);
        env_btn.removeAttribute("style");
        env_btn.innerText = textoOriginal;
        return;
    }

    if (estado === 3) {
        env_btn.style.boxShadow = "5px 5px 5px red";
        env_btn.style.backgroundColor = "red";
        env_btn.style.color = "white";
        env_btn.innerText = "Erro no servidor!";
        set_err("c");
        await sleep(2000);
        env_btn.removeAttribute("style");
        env_btn.innerText = textoOriginal;
    }
}

async function verificarLogin() {
    try {
        const result = await true_fetch("/validate", null, true, true);
        if (result && result.auth) {
            window.location.href = "../index.html";
        }
    } catch (err) {
        console.error("Sessão não ativa.");
    }
}

async function login(user, password) {
    if (!user || !password) {
        return set_button(2);
    }

    try {
        const result = await true_fetch("/login", { user, password }, true, true);

        // Se o servidor retornar 200 mas com mensagem de erro interna
        if (!result || !result.message) {
            set_err("s");
            return set_button(3);
        }

        if (result.message === "Usuário ou senha incorretos") {
            return set_button(2);
        }

        if (result.message === "Login efetuado com sucesso!") {
            await set_button(1);
        } else {
            set_err("s");
            await set_button(3);
        }
    } catch (err) {
        if (err.message && err.message.includes("401")) {
            return set_button(2);
        }

        console.error("Erro na requisição:", err);
        await set_button(3);
    }
}
env_btn.addEventListener("click", async () => {
    if (env_btn.disabled) return; // Evita múltiplos cliques simultâneos
    
    const user = username_input.value.trim();
    const password = password_input.value;
    
    env_btn.disabled = true; 
    await login(user, password);
    env_btn.disabled = false;
});

window.addEventListener("load", verificarLogin);