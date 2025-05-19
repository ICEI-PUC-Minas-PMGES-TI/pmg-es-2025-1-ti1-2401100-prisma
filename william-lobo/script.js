const eventos = [
    {
      id: 1,
      titulo: "Festival Indie",
      local: "Praça da Liberdade",
      data: "20/05/2025",
      genero: "Indie Rock",
      preco: 45.00
    },
    {
      id: 2,
      titulo: "Noite do Samba",
      local: "Sambódromo",
      data: "01/06/2025",
      genero: "Samba",
      preco: 35.00
    },
    {
      id: 3,
      titulo: "Jazz Sunset",
      local: "Parque Municipal",
      data: "15/06/2025",
      genero: "Jazz",
      preco: 50.00
    }
  ];
  
  let favoritos = [];
  
  const filtro = document.getElementById("filtro-genero");
  const container = document.getElementById("eventos-container");
  
  const generos = [...new Set(eventos.map(e => e.genero))];
  generos.forEach(genero => {
    const option = document.createElement("option");
    option.value = genero;
    option.textContent = genero;
    filtro.appendChild(option);
  });
  
  filtro.addEventListener("change", () => {
    renderizarEventos(filtro.value);
  });
  
  renderizarEventos("Todos");
  
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
        <button class="detalhes-btn">Ver Detalhes</button>
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
      document.body.insertBefore(btnCriar, container);
      
      btnCriar.addEventListener("click", () => {
  alert("Funcionalidade de criação ainda não implementada.");
});