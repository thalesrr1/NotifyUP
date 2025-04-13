const fs = require('fs').promises; // Usar versão de Promises do fs
const path = require('path');
const handlebars = require('handlebars');

// Cache simples para templates compilados (melhora performance)
const compiledTemplates = {};

/**
 * Lê, compila (com cache) e renderiza um template Handlebars.
 * @param {string} templateName - nome da pasta do template (ex: 'welcome').
 * @param {object} context - Dados para preencher o template.
 * @returns {Promise<{subject: string, body: string}>} - O assunto e corpo renderizados.
 * @throws {Error} Se o template não for encontrado ou houver erro na leitura/compilação.
 */