// detalhes.js

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('artists-container');
    const noArtistsMessage = document.getElementById('no-artists-message');

    const artistas = JSON.parse(localStorage.getItem('artistas')) || [];

    if (artistas.length === 0) {
        noArtistsMessage.style.display = 'block';
        return;
    }

    noArtistsMessage.style.display = 'none';

    artistas.forEach(artista => {
        const artistProfileDiv = document.createElement('div');
        artistProfileDiv.className = 'artist-profile';

        artistProfileDiv.innerHTML = gerarPerfilArtista(artista);

        container.appendChild(artistProfileDiv);
    });
});

/**
 * Gera o HTML do perfil do artista com base nos dados fornecidos
 * @param {Object} artista - Objeto com os dados do artista
 * @returns {string} - HTML do perfil do artista
 */
function gerarPerfilArtista(artista) {
    return `
        <div class="artist-header">
            <img src="${artista.foto}" alt="Foto de ${artista.nomeArtistico}" class="artist-avatar">
            <h2 class="artist-name">${artista.nomeArtistico}</h2>
            <p class="artist-genre">| ${artista.genero} |</p>
        </div>

        <p class="artist-bio">${artista.descricao}</p>

        <h2 class="section-title">Informações</h2>
        <ul class="info-list">
            <li><strong>Nome da pessoa:</strong> ${artista.nomePessoa}</li>
            <li><strong>Ano de Fundação:</strong> ${artista.anoFundacao}</li>
            <li><strong>Quantidade de Integrantes:</strong> ${artista.qtdIntegrantes}</li>
            <li><strong>Cidade:</strong> ${artista.cidade}</li>
            <li><strong>Telefone:</strong> ${artista.telefone}</li>
            <li><strong>Gênero Artístico:</strong> ${artista.generoArtistico}</li>
        </ul>

        <h2 class="section-title">Onde Encontrar o Artista</h2>
        <div class="social-media">
            ${gerarLinkRede("Spotify", artista.spotify)}
            ${gerarLinkRede("Instagram", artista.instagram)}
            ${gerarLinkRede("YouTube", artista.youtube)}
            ${gerarLinkRede("Facebook", artista.facebook)}
        </div>
    `;
}

/**
 * Gera o HTML para um link de rede social, se a URL estiver presente
 * @param {string} nome - Nome da rede social
 * @param {string} url - URL do perfil
 * @returns {string} - HTML do link ou string vazia
 */
function gerarLinkRede(nome, url) {
    return url ? `<a href="${url}" target="_blank">${nome}</a>` : '';
}
