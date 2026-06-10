const env_btn = document.getElementById("env");
const username_input = document.getElementById("usr");
const password_input = document.getElementById("psw");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function getCookie(nome) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [chave, valor] = cookie.split("=");
    if (chave === nome) {
      return decodeURIComponent(valor);
    }
  }
  return null;
}

async function set_button(estado, user, password) {

    if (estado == "1") {
        env_btn.style.boxShadow = "5px 5px 5px green";
        env_btn.innerText = "Login Realizado com sucesso!";

        await sleep(1500);

        env_btn.removeAttribute("style");

        window.location.href = "../index.html";
    }

    if (estado == "2") {
        env_btn.style.boxShadow = "5px 5px 5px yellow";
        env_btn.style.backgroundColor = "yellow";
        env_btn.innerText = "Usuário ou Senha Incorretos!";

        await sleep(2000);

        env_btn.removeAttribute("style");
    }

    if (estado == "3") {
        env_btn.style.backgroundColor = "red";
        env_btn.style.boxShadow = "5px 5px 5px red";
        env_btn.innerText = "Ocorreu um Erro no Servidor!!";

        await sleep(2000);

        env_btn.removeAttribute("style");
    }
}

async function login(user, password) {
    try {
        const response = await fetch('/login', {
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
            return await set_button("2");
        }

        console.log("Login OK:", result);

        await set_button("1", user, password);

    } catch (err) {
        console.error(err);
        await set_button("3");
    }
}
env_btn.addEventListener("click", async () =>{
    const value_usr=username_input.value;
    const value_psw=password_input.value;
    await login(value_psw, value_usr);
})