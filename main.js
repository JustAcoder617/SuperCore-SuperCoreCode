const morgan=require("morgan");
const express=require("express");
const app=express();
const dotenv=require("dotenv")
const cors=require("cors");
const path=require("path");
const { spawn } = require('child_process');
dotenv.config()
// Seção dos midlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
const PORT = process.env.PORT || 3001;
console.log(`Porta configurada na variável: ${PORT}`);
//======================================================================
//============================== api's-=================================
app.post('/chat', (req, res) => {
    const content = req.body.content;
    const processoPython = spawn('python', ['main.py', content]);

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
app.listen(PORT, () =>{
    console.log(`Servidor RODANDO na porta: ${PORT}`)
});