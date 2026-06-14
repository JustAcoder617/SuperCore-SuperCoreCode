import {true_fetch} from "/dist/readyfetch.js"
function set_err(type) {
    const msgElement = document.getElementById("env");
    if (!msgElement) return;

    let text = "";
    let color = "#ff4a4a";

    switch (type) {
        case "s":
            text = "Erro interno no servidor ou resposta inválida.";
            break;
        case "l":
            text = "Usuário ou senha incorretos.";
            break;
        case "c":
            text = "Erro de conexão. Verifique sua internet.";
            break;
        default:
            text = "Ocorreu um erro inesperado.";
    }

    msgElement.innerText = text;
    msgElement.style.color = color;
}
function red_page(){
    window.location.href="../../index.html"
}
async function send_to_back(data) {
    try{
        let response=true_fetch("/login/create", data, true, true)
        if(!response.message){
            set_err("s")
        }
        if(response.message=="Usuário ou senha incorretos"){
            set_err("l")
        }
        if(response.message=="Login efetuado com sucesso!"){
            red_page()
        }
    }catch(err){
        set_err("c")
    }
}