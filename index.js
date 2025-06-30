// Trabalho Interdisciplinar 1 - Aplicações Web
// Autor: Rommel Vieira Carneiro, adaptado por William Lobo
// Data: 30/06/2025

// 1. Importar todas as bibliotecas necessárias
const jsonServer = require('json-server');
const express = require('express'); // Precisamos do express para servir arquivos estáticos
const path = require('path');

// 2. Criar a aplicação. jsonServer.create() retorna um servidor express.
const server = jsonServer.create();

// 3. Apontar para o arquivo de banco de dados da API
// Usar path.join é mais seguro para criar caminhos de arquivos
const router = jsonServer.router(path.join(__dirname, 'db', 'db.json'));

// 4. Configurar os middlewares padrão
// A opção noCors: true desabilita o CORS, o que pode ser necessário em alguns ambientes.
const middlewares = jsonServer.defaults({ noCors: true });

// 5. Adicionar a "mágica" para servir os arquivos do seu site
// Define o caminho para a pasta que contém seu 'index.html'
const staticPath = path.join(__dirname, 'codigo', 'william-lobo');
// Pede ao servidor para usar essa pasta para servir arquivos estáticos (seu site)
server.use(express.static(staticPath));

// 6. Usar os middlewares e o roteador da API
server.use(middlewares);
// É uma boa prática colocar a API sob um prefixo como /api
// para não ter conflito com as páginas do seu site.
server.use('/api', router); // Acessar a API via /api/contatos

// 7. Iniciar o servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Acesse seu site em http://localhost:${port}`);
  console.log(`Acesse sua API em http://localhost:${port}/api/contatos`);
});