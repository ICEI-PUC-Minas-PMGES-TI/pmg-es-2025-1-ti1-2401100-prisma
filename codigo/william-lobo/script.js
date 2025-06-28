let eventos = [];
let favoritos = [];

const filtro = document.getElementById("filtro-genero");
const container = document.getElementById("eventos-container");

fetch("eventos.json")
  .then(res => res.json())
  .then(data => {
    eventos = data;

    const generos = [...new Set(eventos.map(e => e.genero))];
    generos.forEach(genero => {
      const option = document.createElement("option");
      option.value = genero;
      option.textContent = genero;
      filtro.appendChild(option);
    });

    renderizarEventos("Todos");
  })
  .catch(err => {
    console.error("Erro ao carregar eventos:", err);
  });

filtro.addEventListener("change", () => {
  renderizarEventos(filtro.value);
});

function redirecionarDetalhes(){
  window.location.href = "../lucas-eduardo/event details.html";
}

function renderizarEventos(generoSelecionado) {
  container.innerHTML = "";

  const eventosFiltrados = generoSelecionado === "Todos"
    ? eventos
    : eventos.filter(e => e.genero === generoSelecionado);

  eventosFiltrados.forEach(evento => {
    const card = document.createElement("div");
    card.className = "card";

    const isFavorito = favoritos.includes(evento.id);

    card.innerHTML = `
      <h3>${evento.titulo}</h3>
      <p>📍 ${evento.local}</p>
      <p>📅 ${evento.data}</p>
      <p>🎵 ${evento.genero}</p>
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
      renderizarEventos(filtro.value);
    });

    container.appendChild(card);
  });
}