// --- CONFIGURAÇÃO DO SERVIDOR MULTI-SITE E API ---

// 1. Importar as bibliotecas necessárias
const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const fs = require('fs'); // 'fs' (File System) para ler os diretórios

// 2. Criar a aplicação Express
const server = express();

// 3. Apontar para o arquivo de banco de dados da API
const router = jsonServer.router(path.join(__dirname, 'db', 'db.json'));

// 4. Configurar os middlewares padrão do JSON Server
const middlewares = jsonServer.defaults({ noCors: true });
server.use(middlewares);

// --- LÓGICA PARA SERVIR OS MÚLTIPLOS SITES ---

// 5. Definir o site PRINCIPAL (/) como o do 'william-lobo'
const williamPath = path.join(__dirname, 'codigo', 'william-lobo');
server.use('/', express.static(williamPath));
console.log(`Site principal (/) servido da pasta: ${williamPath}`);

// 6. Servir DINAMICAMENTE todos os outros sites da pasta 'codigo'
const codigoPath = path.join(__dirname, 'codigo');
// Lê todos os nomes de pastas dentro de 'codigo'
const studentFolders = fs.readdirSync(codigoPath).filter(file => 
    fs.statSync(path.join(codigoPath, file)).isDirectory()
);

console.log('Detectando e servindo os seguintes sites:');
studentFolders.forEach(folder => {
  // Cria uma rota para cada pasta. Ex: /arthur-chaves
  const routePath = `/${folder}`;
  // Define o caminho completo para a pasta do aluno
  const folderPath = path.join(codigoPath, folder);
  
  // Configura o Express para servir os arquivos da pasta do aluno nessa rota
  server.use(routePath, express.static(folderPath));
  console.log(`- Rota ${routePath} servida da pasta: ${folderPath}`);
});


// --- CONFIGURAÇÃO FINAL DA API E INICIALIZAÇÃO ---

// 7. Configurar a rota da API (deve vir depois das rotas estáticas)
server.use('/api', router);

// 8. Iniciar o servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`\nServidor rodando em http://localhost:${port}`);
  console.log('Use as rotas acima para acessar cada site individual.');
  console.log(`A API está disponível em /api`);
});