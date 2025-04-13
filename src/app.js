const express = require('express');
import emailRoutes from './routes/emailRoutes.js';

const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rota base para os endpoints de email
app.use('/api/emails', emailRoutes);

// Middleware básico de tratamento de erro (exemplo)
app.use((err, req, res, next) => {
    console.error("Erro não tratado:", err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});


module.exports = app;