const params = new URLSearchParams(window.location.search);
const idEvento = params.get("id");
const container = document.getElementById("detalhes-container");

function carregarDetalhes() {
  const todosEventos = JSON.parse(localStorage.getItem("eventos")) || [];
  const evento = todosEventos.find((ev) => ev.id == idEvento);

  const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (evento) {
    document.getElementById("titulo").innerHTML = evento.titulo;
    document.getElementById(
      "descricao"
    ).innerHTML = `<strong>Descrição:</strong> ${evento.descricao}`;
    document.getElementById(
      "data"
    ).innerHTML = `<strong>Data:</strong> ${dataFormatada.toLocaleString()}`;
    document.getElementById(
      "local"
    ).innerHTML = `<strong>Local:</strong> ${evento.endereco}, ${evento.cidade} - ${evento.estado}`;
    document.getElementById(
      "preco"
    ).innerHTML = `<strong>Preço:</strong> R$ ${evento.preco.toFixed(2)}`;
    document.getElementById(
      "artista"
    ).innerHTML = `<strong>Artista(s):</strong> ${evento.artistas.join(", ")}`;
    document.getElementById(
      "tipo"
    ).innerHTML = `<strong>Tipo:</strong> ${evento.tipo.join(", ")}`;
    document.getElementById(
      "promotor"
    ).innerHTML = `<strong>Promotor:</strong> ${evento.promotores.join(", ")}`;

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
