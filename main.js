const morgan = require("morgan");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { spawn } = require('child_process');

dotenv.config();
let PORT = process.env.PORT || 5001; 

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));

app.post('/chat', (req, res) => {
    const content = req.body.content;
    const historicoRaw = req.body.historico;

    console.log("=== DEBUG DA MEMÓRIA ===");
    console.log("Pergunta recebida:", content);
    console.log("Histórico bruto recebido do Front:", historicoRaw);

    // Se o histórico bruto vier como undefined ou inválido, tratamos como uma lista vazia
    const stringHistorico = historicoRaw ? JSON.stringify(historicoRaw) : "[]";
    
    // Transforma a string JSON em Base64 para passar com segurança pelo terminal do OS
    const historicoBase64 = Buffer.from(stringHistorico).toString('base64');
    console.log("Histórico enviado (Codificado em Base64)");
    console.log("========================");

    // Dispara o script passando a pergunta e a string segura em Base64
    const processoPython = spawn('python3', ['main.py', content, historicoBase64]);

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

app.listen(PORT, () => {
    console.log(`Servidor RODANDO na porta: ${PORT}`);
});