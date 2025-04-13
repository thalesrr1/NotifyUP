// const{ transporter, defautFrom } = require('../config/nodemailer');
// const { parseTemplate } = require('../utils/templateParser');
import { transporter, defaultFrom } from '../config/nodemailer.js';
import {parseTemplate} from '../utils/templateParser.js';

class emailService {

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
                from: from,
                to: to, // Pode ser uma string ou array de strings
                subject: subject,
                html: body,// Corpo do email em HTML
                // text: 'Versão em texto puro do email (opcional)', // Fallback para clientes sem HTML
                ...options // Permite adicionar anexos, headers customizados, etc.
            };

            console.log('Opções do email:', mailOptions);
            const info = await transporter.sendMail(mailOptions);
            console.log(`Enviando email para ${to}...Mensage id: ${info.messageId}`);
            
        } catch (error) {
            
        }
    }
}