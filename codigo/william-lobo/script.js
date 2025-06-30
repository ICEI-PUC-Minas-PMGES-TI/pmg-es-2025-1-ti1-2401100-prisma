let eventos = [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const container = document.getElementById("eventos-container");

const eventosLocal = JSON.parse(localStorage.getItem("eventos")) || [];

function redirecionarDetalhes(id) {
  window.location.href = `../lucas-eduardo/detalhes_evento.html?id=${id}`;
}

function salvarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function renderizarEventos() {
  container.innerHTML = "";

  eventosLocal.forEach((evento) => {
    const card = document.createElement("div");
    card.className = "card";

    const isFavorito = favoritos.includes(evento.id);

    card.innerHTML = `
      <h3>${evento.titulo}</h3>
      <p>📍 ${evento.endereco}</p>
      <p>📅 ${evento.data}</p>
      <p>🎵 ${evento.tipo}</p>
      <p>Preço R$ ${parseFloat(evento.preco).toFixed(2)}</p>
      <!-- ↓↓↓  envia o ID correto ↓↓↓ -->
      <button onclick="redirecionarDetalhes('${evento.id}')" class="detalhes-btn">
        Ver Detalhes
      </button>
      <button class="favorito-btn">
        ${isFavorito ? "❤️ Desfavoritar" : "🤍 Favoritar"}
      </button>
`;

    const btnDetalhes = document.createElement("button");
    btnDetalhes.className = "detalhes-btn";
    btnDetalhes.textContent = "Ver Detalhes";
    btnDetalhes.addEventListener("click", () =>
      redirecionarDetalhes(evento.id)
    );

    const btnFavorito = card.querySelector(".favorito-btn");
    btnFavorito.addEventListener("click", () => {
      if (isFavorito) {
        favoritos = favoritos.filter((id) => id !== evento.id);
      } else {
        favoritos.push(evento.id);
      }
      salvarFavoritos();
      renderizarEventos();
    });

    container.appendChild(card);
  });
}

renderizarEventos();
