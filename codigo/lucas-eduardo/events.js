fetch("eventos.json")
  .then(response => response.json())
  .then(data => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const evento = data.find(e => e.id == id);

    if (evento) {
      document.getElementById("tituloEvento").textContent = evento.titulo;
      document.getElementById("localEvento").textContent = evento.local;
      document.getElementById("precoEvento").textContent = evento.preco;
      document.getElementById("tipoEvento").textContent = evento.tipo;
      document.getElementById("artistasEvento").textContent = evento.artistas.join(", ");
    } else {
      document.getElementById("tituloEvento").textContent = "Evento não encontrado.";
    }
  })
  .catch(error => {
    document.getElementById("tituloEvento").textContent = "Erro ao carregar evento.";
    console.error("Erro ao buscar JSON:", error);
  });
