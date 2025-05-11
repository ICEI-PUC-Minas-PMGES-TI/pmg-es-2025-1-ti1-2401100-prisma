// URL do arquivo JSON hospedado no GitHub
const url = 'https://raw.githubusercontent.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2025-1-ti1-2401100-prisma/refs/heads/master/pedro-rocha-resende/usuarios.json';

// Função para buscar os dados do usuário e colocar no HTML
function carregarDados() {
  fetch(url) // Faz a requisição do JSON
    .then(function(resposta) {
      return resposta.json(); // Converte a resposta em JSON
    })
    .then(function(dados) {
      // Atualiza a foto do perfil
      document.getElementById('foto-perfil').src = dados.fotoPerfil;

      // Atualiza os textos com os dados recebidos
      document.getElementById('nome').textContent = dados.nome;
      document.getElementById('email').textContent = dados.email;
      document.getElementById('descricao').textContent = dados.descricao;

      // Se for artista, mostra o grupo musical
      if (dados.tipo === 'artista') {
        document.getElementById('grupo-musical').style.display = 'block';
        document.getElementById('grupo').textContent = dados.GrupoMusical;
      }

      // Se for promotor, mostra os eventos que organizou
      if (dados.tipo === 'promotor') {
        document.getElementById('eventos').style.display = 'block';
        const lista = document.getElementById('lista-eventos');
        lista.innerHTML = ''; // Limpa antes de inserir
        dados.eventos.forEach(function(evento) {
          const li = document.createElement('li');
          li.textContent = 'Evento ID: ' + evento;
          lista.appendChild(li);
        });
      }

      // Links das redes sociais
      document.getElementById('instagram').href = dados.redesSociais.instagram;
      document.getElementById('facebook').href = dados.redesSociais.facebook;
      document.getElementById('twitter').href = dados.redesSociais.twitter;
    })
    .catch(function(erro) {
      console.error('Erro ao buscar dados do JSON:', erro);
    });
}

// Quando a página carregar, executa a função
document.addEventListener('DOMContentLoaded', carregarDados);

