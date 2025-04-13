const fs = require('fs').promises; // Usar versão de Promises do fs
const path = require('path');
const handlebars = require('handlebars');
const { ifError } = require('assert');

// Cache simples para templates compilados (melhora performance)
const compiledTemplates = {};

/**
 * Lê, compila (com cache) e renderiza um template Handlebars.
 * @param {string} templateName - nome da pasta do template (ex: 'welcome').
 * @param {object} context - Dados para preencher o template.
 * @returns {Promise<{subject: string, body: string}>} - O assunto e corpo renderizados.
 * @throws {Error} Se o template não for encontrado ou houver erro na leitura/compilação.
 */

parseTemplate = async (templateName, context = {}) => {
    const templateDir = path.join(__dirname, '..', 'templates', templateName);
    const subjectPath = path.join(templateDir, 'subject.hbs');
    const bodyPath = path.join(templateDir, 'body.hbs');
    
    try {
        //Lê o conteúdo do arquivo de assunto
        const [subjectContent, bodyContent] = await Promise.all([
            fs.readFile(subjectPath, 'utf-8'),
            fs.readFile(bodyPath, 'utf-8')  
        ]);

        if (!compiledTemplates[`${templateName}_subject`]) {
            // Compila o template de assunto se ainda não estiver compilado
            compiledTemplates[`${templateName}_subject`] = handlebars.compile(subjectContent);
        }

        if (!compiledTemplates[`${templateName}_body`]) {
            // Compila o template de corpo se ainda não estiver compilado
            compiledTemplates[`${templateName}_body`] = handlebars.compile(bodyContent);
        }

        // Renderiza o template com o contexto fornecido
        const subject = compiledTemplates[`${templateName}_subject`](context);
        const body = compiledTemplates[`${templateName}_body`](context);

        return { subject, body };

    } catch (error) {
        console.error(`Erro ao processar template '${templateName}':`, error);

        if (error.code === 'ENOENT') {
            throw new Error(`Template '${templateName}' não encontrado.`);
        }
        throw new Error(`Erro ao ler ou compilar template '${templateName}': ${error.message}`);
    }
}

module.exports = {parseTemplate};