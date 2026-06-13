export async function true_fetch(url, data, Ispost, credentia) {
    const init = {
        method: Ispost ? "POST" : "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: credentia ? "include" : "omit"
    };
    if (init.method === "POST" && data) {
        init.body = JSON.stringify(data);
    }
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }
    const dadosTransformados = await response.json();
    return dadosTransformados;
}
//# sourceMappingURL=readyfetch.js.map