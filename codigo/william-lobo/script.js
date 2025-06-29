let eventos = [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const container = document.getElementById("eventos-container");

const eventosLocal = JSON.parse(localStorage.getItem("eventos")) || [];

function redirecionarDetalhes() {
  window.location.href = "../lucas-eduardo/event details.html";
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
      <button onclick="redirecionarDetalhes()" class="detalhes-btn">Ver Detalhes</button>
      <button class="favorito-btn">
        ${isFavorito ? "❤️ Desfavoritar" : "🤍 Favoritar"}
      </button>
    `;

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
