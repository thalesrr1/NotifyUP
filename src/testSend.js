// src/testSend.js
require('dotenv').config(); // Garante que as variáveis de ambiente sejam carregadas
import send from '../src/services/EmailService.js'; // Ajuste o caminho conforme necessário

async function runTest() {
    console.log('Iniciando teste de envio de email...');

    const testRecipient = process.env.TEST_EMAIL_RECIPIENT || 'teste@exemplo.com'; // Use um email real ou de teste
    if (testRecipient === 'teste@exemplo.com') {
        console.warn("AVISO: Usando email de teste padrão. Defina TEST_EMAIL_RECIPIENT no .env para um teste real.");
    }


    try {
        // Teste 1: Email de Boas-Vindas
        console.log('\n--- Testando template: welcome ---');
        await send(
            testRecipient,
            'welcome', // Nome da pasta do template
            { name: 'Usuário Teste' } // Contexto para o template
        );

        // Teste 2: Email de Redefinição de Senha
        console.log('\n--- Testando template: passwordReset ---');
        await send(
            testRecipient,
            'passwordReset',
            {
                name: 'Usuário Teste',
                resetLink: `http://suaapp.com/reset?token=${Date.now()}` // Exemplo de link
            }
        );

        console.log('\n--- Teste de template inexistente (esperado erro) ---');
        try {
            await send(testRecipient, 'template-que-nao-existe', { name: 'Teste' });
        } catch (error) {
            console.log(`Erro esperado capturado: ${error.message}`); // Deve mostrar erro de template não encontrado
        }


        console.log('\n--- Teste concluído ---');

    } catch (error) {
        console.error('\n--- ERRO GERAL DURANTE O TESTE ---');
        console.error(error.message);
        // Em um cenário real, logar o stack trace completo: console.error(error);
    }
}

runTest();