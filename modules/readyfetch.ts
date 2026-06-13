export async function true_fetch<T = any>(
    url: string, 
    data: any, 
    Ispost?: boolean, 
    credentia?: boolean
): Promise<T> {
    
    const init: RequestInit = {
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
    const dadosTransformados: T = await response.json();
    return dadosTransformados;
}