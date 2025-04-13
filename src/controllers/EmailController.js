import EmailService from '../services/EmailService.js';

class EmailController {
    async sendTestEmail(req, res) {
        const { to, templateName, context } = req.body;
        
        console.log(req.body);  
        // Validação básica de entrada
        if (!to || !templateName) {
            return res.status(400).json({ error: 'Campos "to" e "templateName" são obrigatórios.' });
        }

        try {
            const info = await EmailService.send(to, templateName, context || {});
            return res.status(200).json({ message: `Email enviado com sucesso para ${to}`, info });
        } catch (error) {
            console.error('Erro no Controller ao enviar email:', error);
            // Enviar um erro genérico para o cliente, mas logar o detalhe no servidor
            return res.status(500).json({ error: 'Falha ao enviar o email.', details: error.message });
        }
    }
}


const emailController = new EmailController()
export default emailController;