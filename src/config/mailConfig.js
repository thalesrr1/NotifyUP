require('dotenv').config(); // Carrega as variáveis do .env
const nodemailer = require('nodemailer');

const mailConfig = {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true', // true para 465, false para outras portas
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    // Opção importante para alguns provedores (como Gmail com menos segurança ou portas específicas)
    tls: {
        // Não falhar em certificados inválidos (NÃO RECOMENDADO PARA PRODUÇÃO[pesquisar riscos])
        // rejectUnauthorized: false,
        // Para porta 587, geralmente é necessário
        requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    },
};

// Cria o "transporter" reutilizável com a configuração definida
const transporter = nodemailer.createTransport(mailConfig);

transporter.verify((error, success) => {
    if (error) {
        console.error('Erro ao verificar a configuração do Nodemailer:', error);
    } else {
        console.log('Servidor de email pronto para enviar mensagens.');
    }
});

module.exports = {
    transporter,
    defaultFrom: process.env.MAIL_FROM_ADDRESS || '"Seu App" <no-reply@example.com>',
};