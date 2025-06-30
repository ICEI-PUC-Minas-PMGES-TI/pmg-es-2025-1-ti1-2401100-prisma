const params = new URLSearchParams(window.location.search);
const idEvento = params.get("id");
const container = document.getElementById("detalhes-container");

function carregarDetalhes() {
  const todosEventos = JSON.parse(localStorage.getItem("eventosSalvos")) || [];
  const evento = todosEventos.find((ev) => ev.id == idEvento);

  if (evento) {
    document.getElementById("titulo").textContent = evento.titulo;
    document.getElementById("descricao").textContent = evento.descricao;
    document.getElementById("data").textContent = `Data: ${new Date(
      evento.data
    ).toLocaleString()}`;
    document.getElementById(
      "local"
    ).textContent = `Local: ${evento.local.endereco}, ${evento.local.cidade} - ${evento.local.estado}`;
    document.getElementById(
      "preco"
    ).textContent = `Preço: R$ ${evento.preco.toFixed(2)}`;

    const imagensDiv = document.getElementById("imagens");
    evento.imagens.forEach((img) => {
      const imagem = document.createElement("img");
      imagem.src = img;
      imagem.alt = evento.titulo;
      imagem.style.width = "200px";
      imagem.style.margin = "10px";
      imagensDiv.appendChild(imagem);
    });
  } else {
    container.innerHTML = "<p>Evento não encontrado!</p>";
  }
}

carregarDetalhes();
