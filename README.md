# NotifyUP
## Serviço de Email - Node.js

Este projeto backend Node.js é focado no envio de emails transacionais. Ele utiliza templates HTML (Handlebars) e configurações externalizadas via arquivo `.env`. Permitindo assim, predefinir templates com parametros dinâmicos ou definidos no envio.

## Funcionalidades Principais (MVP)

*   Envio de emails via SMTP configurável.
*   Utilização de templates Handlebars (`.hbs`) para corpo e assunto dos emails.
*   Estrutura organizada para fácil manutenção e adição de novos templates.
*   Configuração centralizada via variáveis de ambiente (`.env`).
*   Tratamento básico de erros no envio.
*   (Opcional) Endpoint de API para testes via HTTP.

## Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão LTS recomendada)
*   [npm](https://www.npmjs.com/) 
*   [Git](https://git-scm.com/)
*   (Opcional) [Postman](https://www.postman.com/) ou similar para testar a API.

## Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/thalesrr1/NotifyUP
    cd email-service-mvp
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

## Configuração

As configurações essenciais do serviço são gerenciadas através de variáveis de ambiente.

1.  **Crie o arquivo `.env`:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env` na raiz do projeto.
    ```bash
    cp .env.example .env
    ```
    **Importante:** O arquivo `.env` contém informações sensíveis (como senhas de email) e **não deve** ser versionado no Git. Ele já está incluído no `.gitignore`.

2.  **Edite o arquivo `.env`:**
    Abra o arquivo `.env` e preencha as variáveis com suas configurações. Preste atenção especial às variáveis `MAIL_*`:

    *   `PORT`: Porta onde o servidor Express (se estiver usando a API) irá rodar (padrão: 3000).
    *   `MAIL_HOST`: Endereço do seu servidor SMTP (ex: `smtp.gmail.com`, `smtp.mailtrap.io`).
    *   `MAIL_PORT`: Porta do servidor SMTP (ex: 587, 465, 2525).
    *   `MAIL_USER`: Nome de usuário para autenticação no servidor SMTP.
    *   `MAIL_PASS`: Senha para autenticação no servidor SMTP.
    *   `MAIL_FROM_ADDRESS`: Endereço de email que aparecerá como remetente (ex: `"Seu App" <no-reply@seuapp.com>`).
    *   `MAIL_SECURE`: Defina como `true` se a conexão usar SSL (normalmente na porta 465), `false` caso contrário (TLS na porta 587 ou sem segurança).
    *   `MAIL_REQUIRE_TLS`: Defina como `true` se o servidor SMTP exigir TLS (comum na porta 587).
    *   `TEST_EMAIL_RECIPIENT`: (Opcional) Email de destino usado pelo script `npm run test:send`.

    **Recomendação para Desenvolvimento:** Utilize um serviço de teste como o [Mailtrap.io](https://mailtrap.io/). Ele captura os emails enviados sem entregá-los de fato, permitindo que você os inspecione com segurança. As configurações de exemplo no `.env.example` são compatíveis com o Mailtrap.

## Rodando a Aplicação

Existem algumas formas de executar o projeto:

1.  **Modo de Desenvolvimento (com API):**
    Utiliza o `nodemon` para reiniciar automaticamente o servidor quando detectar alterações nos arquivos. Ideal para desenvolvimento ativo.
    ```bash
    npm run dev
    ```
    O servidor estará disponível (por padrão) em `http://localhost:3000`.

2.  **Modo de Produção (com API):**
    Executa o servidor diretamente com Node.js. Use este comando para implantações.
    ```bash
    npm start
    ```

3.  **Script de Teste Rápido (via CLI):**
    Executa o script `src/testSend.js` que envia emails de teste (definidos no script) para o endereço configurado em `TEST_EMAIL_RECIPIENT` no `.env`, sem iniciar um servidor web. Útil para verificar rapidamente a configuração de envio.
    ```bash
    npm run test:send
    ```

## Testando com Postman (API)

Se você estiver rodando a aplicação com `npm run dev` ou `npm start`, você pode usar o Postman para testar o endpoint de envio de email:

1.  **Verifique se o servidor está rodando.**
2.  **Abra o Postman.**
3.  **Crie uma nova requisição:**
    *   **Método:** `POST`
    *   **URL:** `http://localhost:PORT/api/emails/send` (substitua `PORT` pelo valor definido no seu `.env`, ex: `http://localhost:3000/api/emails/send`)
    *   **Headers:** Adicione um header `Content-Type` com o valor `application/json`.
    *   **Body:** Selecione a opção `raw` e escolha `JSON` no dropdown. Cole o seguinte JSON no corpo da requisição:

        ```json
        {
          "to": "destinatario@exemplo.com",
          "templateName": "welcome",
          "context": {
            "name": "Nome do Usuário Teste via Postman"
          }
        }
        ```

4.  **Entendendo o JSON de Envio:**
    *   `to` (obrigatório): String contendo o endereço de email do destinatário.
    *   `templateName` (obrigatório): String com o nome da pasta do template que você deseja usar (localizada em `src/templates/`). No exemplo acima, estamos usando o template `welcome`.
    *   `context` (opcional): Objeto JSON contendo os dados que serão usados para preencher as variáveis dentro do template Handlebars (`.hbs`).
        *   No exemplo `welcome`, o template (`subject.hbs` e/ou `body.hbs`) provavelmente contém `{{name}}`. O valor `"Nome do Usuário Teste via Postman"` será substituído nesse local.

5.  **Enviando a Requisição:** Clique em "Send".

6.  **Resposta Esperada:**
    *   **Sucesso (Status 200 OK):**
        ```json
        {
          "message": "Email enviado com sucesso para destinatario@exemplo.com",
          "info": {
            // Detalhes do envio retornado pelo Nodemailer
            "messageId": "<...",
            "response": "250 OK...",
            // ... outros detalhes
          }
        }
        ```
        Verifique sua caixa de entrada ou o Mailtrap para confirmar o recebimento e a aparência do email.
    *   **Erro (Status 400 Bad Request):** Se faltarem campos obrigatórios (`to` ou `templateName`).
        ```json
        {
          "error": "Campos \"to\" e \"templateName\" são obrigatórios."
        }
        ```
    *   **Erro (Status 500 Internal Server Error):** Se ocorrer um problema no servidor (template não encontrado, erro de SMTP, etc.). Verifique os logs do console do servidor Node.js para mais detalhes.
        ```json
        {
          "error": "Falha ao enviar o email.",
          "details": "Mensagem específica do erro (ex: Template 'xyz' não encontrado...)"
        }
        ```

7.  **Testando Outros Templates:**
    Para usar um template diferente, como `passwordReset`, que pode precisar de outros dados no contexto, ajuste o JSON:

    ```json
    {
      "to": "outro_usuario@exemplo.com",
      "templateName": "passwordReset",
      "context": {
        "name": "Nome do Outro Usuário",
        "resetLink": "http://seu-site.com/redefinir-senha?token=ABC123XYZ"
      }
    }
    ```
    Neste caso, o template `passwordReset` (arquivos `subject.hbs` e `body.hbs`) deve usar as variáveis `{{name}}` e `{{resetLink}}`. O valor de `resetLink` é simplesmente um dado que você passa; ele será inserido no corpo do email onde `{{resetLink}}` estiver presente, geralmente dentro de uma tag `<a>`.

## Estrutura de Templates (`src/templates/`)

O sistema de templates é projetado para ser simples e extensível. Para adicionar um novo tipo de email:

1.  **Crie uma Nova Pasta:** Dentro de `src/templates/`, crie uma nova pasta com um nome descritivo para o seu template (ex: `orderConfirmation`, `newsletterSignup`, `invitation`). **O nome desta pasta será o `templateName`** que você usará na API ou no `EmailService.send()`.

2.  **Crie os Arquivos `.hbs`:** Dentro da nova pasta, crie **obrigatoriamente** dois arquivos:
    *   `subject.hbs`: Este arquivo contém o **assunto** do email. Você pode usar variáveis Handlebars aqui (ex: `Bem-vindo(a), {{userName}}!`).
    *   `body.hbs`: Este arquivo contém o **corpo** do email, preferencialmente em formato HTML. Use variáveis Handlebars para inserir dados dinâmicos (ex: `<p>Seu código de verificação é: <strong>{{verificationCode}}</strong></p>`).

3.  **Use Variáveis do Contexto:** As variáveis que você define no objeto `context` ao chamar o serviço (ou na requisição Postman) estarão disponíveis dentro dos seus arquivos `.hbs` usando a sintaxe `{{nomeDaVariavel}}`.

    *   **Exemplo:** Para criar um template de confirmação de pedido:
        *   Crie a pasta `src/templates/orderConfirmation/`.
        *   Crie `src/templates/orderConfirmation/subject.hbs` com: `Confirmação do Pedido #{{orderId}}`
        *   Crie `src/templates/orderConfirmation/body.hbs` com:
            ```html
            <h1>Pedido Confirmado!</h1>
            <p>Olá {{customerName}},</p>
            <p>Obrigado por seu pedido número <strong>{{orderId}}</strong>.</p>
            <p>Total: R$ {{totalAmount}}</p>
            ```
        *   Para enviar este email, você chamaria o serviço/API com:
            *   `templateName: "orderConfirmation"`
            *   `context: { orderId: "PED123", customerName: "Maria Silva", totalAmount: "99.90" }`

4.  **Pronto!** O `EmailService` e o `templateParser` encontrarão automaticamente sua nova pasta e arquivos quando você usar o `templateName` correspondente. Não é necessário registrar o template em nenhum outro lugar no código.

## Próximos Passos (Sugestões)

*   Implementar um sistema de filas para envio assíncrono.
*   Melhorar o tratamento de erros e logging (ex: Winston, Sentry).
*   Desenvolver uma interface frontend para gerenciar configurações e templates.
*   Abstrair o provedor de email (permitir SES, SendGrid, etc.).
*   Adicionar testes automatizados (unitários e de integração).
