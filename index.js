// --- CONFIGURAÇÃO CORRIGIDA DO SERVIDOR MULTI-SITE E API ---

// 1. Importar as bibliotecas necessárias
const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const fs = require('fs');

// 2. Criar a aplicação Express
const server = express();


// --- LÓGICA PARA SERVIR OS MÚLTIPLOS SITES ---
// !!! IMPORTANTE: Nossas regras de página vêm PRIMEIRO !!!

// 3. Define o site PRINCIPAL (/) como o do 'william-lobo'
const williamPath = path.join(__dirname, 'codigo', 'william-lobo');
server.use('/', express.static(williamPath));


// 4. Servir DINAMICAMENTE todos os outros sites da pasta 'codigo'
const codigoPath = path.join(__dirname, 'codigo');
try {
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
} catch (error) {
  console.error('ERRO ao ler a pasta "codigo":', error);
}


// --- CONFIGURAÇÃO FINAL DA API E INICIALIZAÇÃO ---
// !!! As regras da API e do JSON Server vêm por ÚLTIMO !!!

// 5. Apontar para o arquivo de banco de dados da API
const router = jsonServer.router(path.join(__dirname, 'db', 'db.json'));

// 6. Configurar e usar os middlewares e a rota da API
const middlewares = jsonServer.defaults({ noCors: true });
server.use('/api', router); // Rota específica para a API
server.use(middlewares);   // Middlewares padrão do JSON server


// 7. Iniciar o servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`\nServidor rodando em http://localhost:${port}`);
  console.log('Acesse o site principal ou as rotas individuais dos alunos.');
  console.log(`A API está disponível em /api`);
});