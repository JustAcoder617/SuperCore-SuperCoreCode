const morgan = require("morgan");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const path = require("path");
const { spawn } = require('child_process');
const mysql=require("mysql2");
const { error } = require("console");
const db=mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_psw,
    database: "supercore_db"
});
db.connect((error)=>{
    if(error){
        console.error(`Erro ao conectar ao database: ${error}`)
    } else{
        console.log("Conectado om sucesso ao database.")
    }
})
let PORT = process.env.PORT || 5001; 

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));
app.enable("trust proxy")
//================================ rotas api ===================================
app.post('/chat', (req, res) => {
    const content = req.body.content;
    const modelo_ia = req.body.model;

    console.log("=== DEBUG DA REQUISIÇÃO ===");
    console.log("Pergunta recebida:", content);
    console.log("Modelo escolhido:", modelo_ia);
    console.log("===========================");
    let ip=req.ip;
    const processoPython = spawn('python3', ['main.py', content, modelo_ia, ip]);

    let respostaDaIA = "";

    processoPython.stdout.on('data', (data) => {
        respostaDaIA += data.toString();
    });

    processoPython.stderr.on('data', (data) => {
        console.error(`Erro no Python: ${data}`);
    });

    processoPython.on('close', (code) => {
        if (code === 0) {
            res.json({ message: respostaDaIA.trim() });
        } else {
            res.status(500).json({ message: "Erro ao processar a IA no servidor." });
        }
    });
});
app.get("/", (req, res) =>{
    res.sendStatus(200);
})
app.get("/chat" , (req, res) => {
    res.status(403).send("Only Post, if you are an normal user, please leave this route.");
});
app.post("/login", (req, res) => {
    const { user, password } = req.body;
    const str = "SELECT * FROM Users WHERE Nome = ? AND Senha = ?";

    db.query(str, [user, password], (err, result) => {
        if (err) {
            console.error("Erro no banco:", err);
            return res.sendStatus(403); 
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Usuário ou senha incorretos" });
        }
        const usuarioLogado = result[0];

        res.status(200).json({
            message: "Login efetuado com sucesso!",
            user: {
                id: usuarioLogado.id,
                nome: usuarioLogado.Nome
            }
        });
    });
});

app.post("/login/create", async (req, res) =>{
    const {user,password}=req.body;
    const sql=(`INSERT INTO Users (Nome, senha) VALUES (?,?)`);
    db.query(sql, [user,password], (err, result)=>{
        if(err){
            console.error(`Erro ao criar novo usuário no banco de dados: ${err}`);
            res.status(500).json({
                message: "Ocorreu um erro no servidor."
            })
        }
        if(result){
            res.status(201).json({
                message: "OK"
            });
        }
    });

})
// =========================================================================
app.listen(PORT, () => {
    console.log(`Servidor RODANDO na porta: ${PORT}`);
});