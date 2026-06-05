const button_env=document.getElementById("enviar");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function wait_for_ia_reponse(data){
    document.getElementById("response").innerHTML=`
    Pensando...
    `
    let response= await fetch('/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if(response.ok){
        document.getElementById("response").innerText=(await response.json()).message;
        await sleep(5000);
    } else{
        document.getElementById("response").innerText="Desculpe, mas ocorreu um erro no servidor."
    }
}
button_env.addEventListener("click", async () =>{
    const dados={
        content: document.getElementById("ask").value
    };
    await wait_for_ia_reponse(dados);
});