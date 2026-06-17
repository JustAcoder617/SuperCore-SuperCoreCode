import morgan from "morgan";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Simulação do __dirname necessária para o modo ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_psw,
    database: process.env.db_name
});

app.use(cookieParser());

db.connect((error) => {
    if (error) {
        console.error(`Erro ao conectar ao database: ${error}`);
    } else {
        console.log("Conectado com sucesso ao database.");
    }
});

let PORT = process.env.PORT || 5001; 

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "client")));
app.use("/dist", express.static(path.join(__dirname, "dist")));
app.enable("trust proxy");

const autenticarToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Acesso negado. Token não encontrado." });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token inválido ou expirado." });
        req.user = decoded;
        next();
    });
};

// ================================= Funções Auxiliares ===================================
function isJSONString(str) {
    if (typeof str !== 'string') return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

async function buscarNoSearXNG(termo) {
    const url = 'http://localhost:8080/search';
    
    const corpo = new URLSearchParams();
    corpo.append('q', termo);
    corpo.append('format', 'json');
    corpo.append('lang', 'pt-BR');

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: corpo
        });

        if (!resposta.ok) {
            throw new Error(`Erro no SearXNG: Status ${resposta.status}`);
        }

        const dados = await resposta.json();
        
        if (!dados.results || dados.results.length === 0) {
            return "Nenhum resultado encontrado.";
        }
        return dados.results.slice(0, 6).map(item => {
            console.log(`Resultado encontrado: ${item.title}`);
            const textoInformativo = item.content || item.snippet || "";
            return `Título: ${item.title} | Contexto: ${textoInformativo}`;
        }).join('\n');

    } catch (erro) {
        console.error("Erro ao buscar no SearXNG:", erro);
        return null;
    }
}

function executarPython(prompt, modelo, ip, cargo) {
    return new Promise((resolve, reject) => {
        const processoPython = spawn("python3", ["main.py", prompt, modelo, ip, cargo]);
        let resultado = "";
        let erro = "";

        processoPython.stdout.on("data", (data) => { resultado += data.toString(); });
        processoPython.stderr.on("data", (data) => { erro += data.toString(); });

        processoPython.on("close", (code) => {
            if (code === 0) resolve(resultado.trim());
            else reject(erro || `Código de saída: ${code}`);
        });
    });
}

// ================================= Rotas API ===================================
app.post("/chat", async (req, res) => {
    const { content, model: modelo_ia } = req.body;
    
    if (!content || !modelo_ia || typeof content !== "string" || typeof modelo_ia !== "string" || content.trim() === "") {
        return res.status(400).send("Prompt inválido.");
    }
    console.log(`Nova request: prompt: ${content} modelo: ${modelo_ia}`);
    
    let ip = req.ip;

    try {
        let respostaDaIA = await executarPython(content, modelo_ia, ip);

        if (isJSONString(respostaDaIA)) {
            const objetoIA = JSON.parse(respostaDaIA);
            console.log(`Request em JSON da IA: \n ${respostaDaIA}`);
            
            if (objetoIA.requer_internet === true && objetoIA.termo_busca) {
                const resultadosWeb = await buscarNoSearXNG(objetoIA.termo_busca);

                if (resultadosWeb) {
                    const novoPromptContexto = `
                        Ano Atual do Sistema: 2026.
                        O usuário solicitou informações atualizadas: "${content}"
                        
                        Dados e notícias reais coletados da internet em tempo real:
                        ${resultadosWeb}
                        
                        DIRETRIZES PARA A RESPOSTA FINAL:
                        - Escreva uma resposta detalhada, organizada e rica em conteúdo utilizando as informações acima.
                        - Use formatação Markdown (negritos, bullet points) para estruturar melhor a resposta.
                        - Responda estritamente em formato de texto corrente. PROIBIDO usar JSON aqui.
                    `;
                    
                    respostaDaIA = await executarPython(novoPromptContexto, modelo_ia, ip);
                    if (isJSONString(respostaDaIA)) {
                        console.log("IA insistiu no JSON na rodada final. Forçando renderização direta...");
                        respostaDaIA = `Aqui estão as informações mais recentes encontradas sobre o seu pedido:\n\n${resultadosWeb}`;
                    }
                } else {
                    respostaDaIA = "Desculpe, tive dificuldades para acessar a internet e coletar dados em tempo real agora.";
                }
            } else {
                console.log("IA tentou dar migué com 'requer_internet: false'. Forçando resposta textual...");
                const promptForçado = `
                    Você é o SuperCore. O usuário perguntou: "${content}".
                    Você determinou que não precisa da internet para isso. 
                    Portanto, responda AGORA em texto amigável e corrido em português. 
                    NÃO ENVIE código JSON.
                `;
                respostaDaIA = await executarPython(promptForçado, modelo_ia, ip, "system");
            }
        }

        return res.status(200).json({ message: respostaDaIA });

    } catch (err) {
        console.error("Erro interno no fluxo do chat:", err);
        return res.status(500).json({ message: "Erro ao processar a IA no servidor." });
    }
});

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.get("/chat", (req, res) => {
    res.status(403).send("Only Post, if you are an normal user, please leave this route.");
});

app.post("/login", (req, res) => {
    const { user, password } = req.body;
    
    if (!password || !user || typeof user !== "string" || typeof password !== "string" || user.trim() === "" || password.trim() === "") {
        return res.status(400).send("Dados inválidos.");
    }

    const str = "SELECT * FROM Users WHERE Nome = ?";

    db.query(str, [user], async (err, result) => {
        if (err) return res.status(500).json({ message: "Erro no servidor" });
        if (result.length === 0) return res.status(401).json({ message: "Usuário ou senha incorretos" });

        const usuarioLogado = result[0];
        const senhaCorreta = await bcrypt.compare(password, usuarioLogado.Senha);

        if (!senhaCorreta) return res.status(401).json({ message: "Usuário ou senha incorretos" });
        
        const token = jwt.sign(
            { id: usuarioLogado.id, nome: usuarioLogado.Nome },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        res.status(200).json({ message: "Login efetuado com sucesso!" });
    });
});

app.post("/login/create", async (req, res) => {
    const { user, password } = req.body;

    if (!password || !user || typeof user !== "string" || typeof password !== "string" || user.trim() === "" || password.trim() === "") {
        return res.status(400).send("Dados inválidos.");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO Users (Nome, Senha) VALUES (?,?)";
        
        db.query(sql, [user, passwordHash], (err, result) => {
            if (err) {
                console.error(`Erro ao criar novo usuário no banco de dados: ${err}`);
                return res.status(500).json({ message: "Ocorreu um erro no servidor ao criar o usuário." });
            }
            
            const token = jwt.sign(
                { id: result.insertId, nome: user },
                process.env.JWT_SECRET,
                { expiresIn: "3d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3 * 24 * 60 * 60 * 1000,
                path: "/"
            });

            return res.status(201).json({ message: "Usuário criado com sucesso!" });
        });
    } catch (error) {
        console.error("Erro ao gerar hash da senha:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

app.post("/validate", (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ auth: false, message: "Token não encontrado." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ auth: false, message: "Token inválido." });
        }

        return res.status(200).json({
            auth: true,
            message: "Token OK",
            userId: decoded.id,
            nome: decoded.nome
        });
    });
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout efetuado com sucesso." });
});

app.listen(PORT, () => {
    console.log(`Servidor RODANDO na porta: ${PORT}`);
});