const env_btn=document.getElementById("env");
const reponse_entry=document.getElementById("reponse");
let user_to_ia_data=document.getElementById("ask");
async function esperar_resposta_ia(data){
    const response= await fetch ("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if(response.ok){
        return response.json();
    }else{
        return "ERROR";
    }
}
env_btn.addEventListener("click", async () =>{
    reponse_entry.innerText="Pensando...";
    const data={
        content: user_to_ia_data.value,
        model: "qwen2.5-coder:1.5b"
    }
    const reponse=await esperar_resposta_ia(data)
    if(response!="ERROR"){
        reponse_entry.innerText=reponse;
    }else{
        reponse_entry.innerText="Ocorreu um erro no servidor! Tente Novamente."
    }
})