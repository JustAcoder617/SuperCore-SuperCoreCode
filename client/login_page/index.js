const env_btn=document.getElementById("env");
const username_input=document.getElementById("usr");
const password_input=document.getElementById("psw");
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
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

function set_button(estado, user, password){
    if(estado=="1"){
        env_btn.style.boxShadow="5px 5px 5px green";
        env_btn.innerText="Login Realizado com sucesso!";
        await sleep(5000);
        env_btn.style="";
        set_logged_login();
        window.location.href="../index.html"
    }
    if(estado=="2"){
        env_btn.style.boxShadow="5px 5px 5px yellow";
        env_btn.style.backgroundColor="yellow"
        env_btn.innerText="Usuário ou Senha Incorretos!";
        await sleep(5000);
        env_btn.style="";
    }
}


async function set_logged_login(user, password){
    let pass;
    try{
        const data={
            content: password
        }
        let response = await fetch('/get_hash', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }catch(err){

    }
    document.cookie(`user=${user}; psw=${pass}; max-age=259.200; path=/; Secure; SameSite=Strict;`)
}



function set_button(estado, user, password){
    if(estado=="1"){
        env_btn.style.boxShadow="5px 5px 5px green";
        env_btn.innerText="Login Realizado com sucesso!";
        await sleep(5000);
        env_btn.style="";
        set_logged_login();
        window.location.href="../index.html"
    }
    if(estado=="2"){
        env_btn.style.boxShadow="5px 5px 5px yellow";
        env_btn.style.backgroundColor="yellow"
        env_btn.innerText="Usuário ou Senha Incorretos!";
        await sleep(5000);
        env_btn.style="";
    }
}
async function enviar_dados_ao_sv(data) {
    try{

    }catch(err){

    }
}