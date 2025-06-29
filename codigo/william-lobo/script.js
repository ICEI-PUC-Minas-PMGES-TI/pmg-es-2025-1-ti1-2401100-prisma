let favoritos = [];

const container = document.getElementById("eventos-container");

// Função para inicializar dados no localStorage se não existirem
async function inicializarEventos() {
  let eventosSalvos = JSON.parse(localStorage.getItem("eventosSalvos"));
  if (!eventosSalvos || eventosSalvos.length === 0) {
    try {
      const res = await fetch("../pedro-rocha-resende/data/eventos.json");
      const data = await res.json();
      localStorage.setItem("eventosSalvos", JSON.stringify(data));
    } catch (err) {
      console.error("Erro ao carregar eventos do JSON:", err);
    }
  }
}

// Renderiza os cards a partir dos dados do localStorage
function renderizarEventos() {
  const eventos = JSON.parse(localStorage.getItem("eventosSalvos")) || [];
  container.innerHTML = "";

  eventos.forEach((evento) => {
    const card = document.createElement("div");
    card.className = "card";

    const isFavorito = favoritos.includes(evento.id);

    card.innerHTML = `
      <h3>${evento.titulo}</h3>
      <p>📍 ${evento.local.cidade} - ${evento.local.estado}</p>
      <p>📅 ${new Date(evento.data).toLocaleDateString()}</p>
      <p>🎵 ${evento.categoria}</p>
      <p>Preço R$ ${evento.preco.toFixed(2)}</p>
    `;

    const btnDetalhes = document.createElement("button");
    btnDetalhes.className = "detalhes-btn";
    btnDetalhes.textContent = "Ver Detalhes";
    btnDetalhes.addEventListener("click", () =>
      redirecionarDetalhes(evento.id)
    );

    const btnFavorito = document.createElement("button");
    btnFavorito.className = "favorito-btn";
    btnFavorito.textContent = isFavorito ? "❤️ Desfavoritar" : "🤍 Favoritar";
    btnFavorito.addEventListener("click", () => {
      if (favoritos.includes(evento.id)) {
        favoritos = favoritos.filter((id) => id !== evento.id);
      } else {
        favoritos.push(evento.id);
      }
      renderizarEventos();
    });

    card.appendChild(btnDetalhes);
    card.appendChild(btnFavorito);

    container.appendChild(card);
  });
}

// Redireciona para a página de detalhes usando query string
function redirecionarDetalhes(id) {
  window.location.href = `../lucas-eduardo/detalhes_evento.html?id=${id}`;
}

// Inicializar e renderizar
(async function () {
  await inicializarEventos();
  renderizarEventos();
})();
