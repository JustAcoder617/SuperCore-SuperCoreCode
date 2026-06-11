const env_btn = document.getElementById("env");
const username_input = document.getElementById("usr");
const password_input = document.getElementById("psw");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function set_button(estado) {
    const textoOriginal = "Entrar";

    if (estado === 1) {
        env_btn.style.boxShadow = "5px 5px 5px green";
        env_btn.style.backgroundColor = "green";
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

        await sleep(2000);

        env_btn.removeAttribute("style");
        env_btn.innerText = textoOriginal;
        return;
    }

    if (estado === 3) {
        env_btn.style.boxShadow = "5px 5px 5px red";
        env_btn.style.backgroundColor = "red";
        env_btn.innerText = "Erro no servidor!";

        await sleep(2000);

        env_btn.removeAttribute("style");
        env_btn.innerText = textoOriginal;
    }
}

async function verificarLogin() {
    try {
        const response = await fetch("/validate", {
            method: "POST",
            credentials: "include"
        });

        const result = await response.json();

        if (response.ok && result.auth) {
            window.location.href = "../index.html";
        }

    } catch (err) {
        console.error("Erro ao validar sessão:", err);
    }
}

async function login(user, password) {
    try {

        if (!user || !password) {
            return set_button(2);
        }

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                user,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(result.message);
            return set_button(2);
        }

        console.log("Login OK:", result);

        await set_button(1);

    } catch (err) {
        console.error(err);
        await set_button(3);
    }
}

env_btn.addEventListener("click", async () => {
    const user = username_input.value.trim();
    const password = password_input.value;

    await login(user, password);
});

window.addEventListener("load", verificarLogin);