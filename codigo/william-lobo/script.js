let eventos = [];
let favoritos = [];

const container = document.getElementById("eventos-container");

fetch("eventos.json")
  .then(res => res.json())
  .then(data => {
    const eventosLocal = JSON.parse(localStorage.getItem("eventosSalvos")) || [];
    eventos = [...data, ...eventosLocal];
    renderizarEventos();
  })
  .catch(err => {
    console.error("Erro ao carregar eventos:", err);
  });

function redirecionarDetalhes() {
  window.location.href = "../lucas-eduardo/event details.html";
}

function renderizarEventos() {
  container.innerHTML = "";

  const eventosFiltrados = eventos;

  eventosFiltrados.forEach(evento => {
    const card = document.createElement("div");
    card.className = "card";

    const isFavorito = favoritos.includes(evento.id);

    card.innerHTML = `
      <h3>${evento.titulo}</h3>
      <p>📍 ${evento.local}</p>
      <p>📅 ${evento.data}</p>
      <p>🎵 ${evento.categoria}</p>
      <p>Preço R$ ${evento.preco.toFixed(2)}</p>
      <button onclick="redirecionarDetalhes()" class="detalhes-btn">Ver Detalhes</button>
      <button class="favorito-btn">${isFavorito ? "❤️ Desfavoritar" : "🤍 Favoritar"}</button> 
    `;

    const btnFavorito = card.querySelector(".favorito-btn");
    btnFavorito.addEventListener("click", () => {
      if (favoritos.includes(evento.id)) {
        favoritos = favoritos.filter(id => id !== evento.id);
      } else {
        favoritos.push(evento.id);
      }
      renderizarEventos();
    });

    container.appendChild(card);
  });
}
