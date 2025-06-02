document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form-artista");
  const listaContainer = document.createElement("div");
  form.parentElement.appendChild(listaContainer);

  function getArtistas() {
    return JSON.parse(localStorage.getItem("artistas")) || [];
  }

  function salvarArtistas(artistas) {
    localStorage.setItem("artistas", JSON.stringify(artistas));
  }

  function renderizarLista() {
    const artistas = getArtistas();
    listaContainer.innerHTML = "<h3>Artistas Cadastrados</h3>";

    if (artistas.length === 0) {
      listaContainer.innerHTML += "<p>Nenhum artista cadastrado.</p>";
      return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Nome Artístico</th>
          <th>Tipo de Espetáculo</th>
          <th>Cidade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${artistas
          .map(
            (artista, index) => `
          <tr>
            <td>${artista.nomeArtistico}</td>
            <td>${artista.tipoEspetaculo}</td>
            <td>${artista.cidade}</td>
            <td>
              <button onclick="editarArtista(${index})">Editar</button>
              <button onclick="excluirArtista(${index})">Excluir</button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    `;
    listaContainer.appendChild(table);
  }

  // Função para novo cadastro
  function cadastrarNovo(e) {
    e.preventDefault();

    const novoArtista = Object.fromEntries(new FormData(form));
    const artistas = getArtistas();
    artistas.push(novoArtista);
    salvarArtistas(artistas);
    renderizarLista();
    form.reset();
  }

  form.addEventListener("submit", cadastrarNovo);

  // Funções globais
  window.editarArtista = function (index) {
    const artistas = getArtistas();
    const artista = artistas[index];

    for (let campo in artista) {
      if (form.elements[campo]) {
        form.elements[campo].value = artista[campo];
      }
    }

    form.removeEventListener("submit", cadastrarNovo);

    form.onsubmit = function (e) {
      e.preventDefault();
      const dadosAtualizados = Object.fromEntries(new FormData(form));
      artistas[index] = dadosAtualizados;
      salvarArtistas(artistas);
      renderizarLista();
      form.reset();
      form.onsubmit = null;
      form.addEventListener("submit", cadastrarNovo);
    };
  };

  window.excluirArtista = function (index) {
    if (confirm("Deseja realmente excluir este artista?")) {
      const artistas = getArtistas();
      artistas.splice(index, 1);
      salvarArtistas(artistas);
      renderizarLista();
    }
  };

  renderizarLista();
});
