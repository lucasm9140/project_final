const express = require("express");
const axios = require("axios");
const cors = require('cors');

const app = express();
const port = 3000;

// Habilitar CORS para permitir requisições do frontend
app.use(cors());
app.use(express.json());

// Rota para consumir a API FastAPI e obter a previsão
app.post("/predict", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/predict/", req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao fazer a requisição para a API FastAPI:", error.message);
        res.status(500).json({ error: "Erro ao fazer a previsão" });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor Node.js rodando na porta ${port}`);
});