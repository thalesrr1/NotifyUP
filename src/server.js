import 'dotenv/config' // Carrega .env ANTES de tudo
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    // A verificação do mailConfig já acontece quando ele é importado
});