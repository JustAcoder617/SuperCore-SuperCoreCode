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
    const modelo_ia = req.body.model;

    console.log("=== DEBUG DA REQUISIÇÃO ===");
    console.log("Pergunta recebida:", content);
    console.log("Modelo escolhido:", modelo_ia);
    console.log("===========================");

    // Dispara o script Python passando apenas a pergunta e o modelo por argumento
    const processoPython = spawn('python3', ['main.py', content, modelo_ia]);

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