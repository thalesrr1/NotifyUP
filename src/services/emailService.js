import { transporter } from '../config/mailConfig.js';
import parseTemplate from '../utils/templateParser.js';

class EmailService {

    /**
   * Envia um email usando um template e contexto definidos.
   * @param {string} to - Endereço de email do destinatário.
   * @param {string} templateName - Nome do template (pasta em src/templates/).
   * @param {object} context - Dados para o template (ex: { name: 'Usuário', link: '...' }).
   * @param {string} [from] - Remetente (opcional, usa defaultFrom se não fornecido).
   * @param {object} [options] - Opções adicionais do Nodemailer (ex: attachments).
   * @returns {Promise<object>} - Informações sobre o envio (messageId, etc.) ou lança erro.
   * @throws {Error} Se houver falha no envio ou no processamento do template.
   */
    async send() {
        if (!to || !templateName) {
            throw new Error('Destinatário e nome do template são obrigatórios.');
        }

        console.log(`Preparando envio de email para ${to} usando template ${templateName}...`);

        try {
            const {subject, body} = await parseTemplate(templateName, context); 

            const mailOptions = {
                from: from, // Remetente do email (opcional)
                to: to, // Pode ser uma string ou array de strings
                subject: subject, // Assunto do email
                html: body,// Corpo do email em HTML
                // text: 'Versão em texto puro do email (opcional)', // Fallback para clientes sem HTML
                ...options // Permite adicionar anexos, headers customizados, etc.
            };

            console.log('Opções do email:', mailOptions);
            const info = await transporter.sendMail(mailOptions);
            console.log(`Enviando email para ${to}...Mensage id: ${info.messageId}`);

            return info; // Retorna informações do envio (messageId, etc.)
        } catch (error) {
            //Erro pode ser de leitura do template ou envio do email
            console.log(`Falha ao enviar email para ${to} usando template ${templateName}:`, error);
            // Vou adicionar lógicas mais complexas:
            // - Tentar reenviar? (loops de reenvio)
            // - Enviar para um serviço de monitoramento de erros (Sentry, etc.)
            // - Salvar a falha em um banco de dados para análise posterior
            // - Retornar um erro mais específico dependendo do código do erro do Nodemailer
            
            // Por enquanto, mostro o erro para quem chamou o serviço saber da falha
            throw new Error(`Falha no envio do email: ${error.message}`);
        }
    }
}

export default new EmailService();