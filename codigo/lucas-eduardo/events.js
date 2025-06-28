// url JSON de eventos.
fetch("eventos.json")
  .then(response => response.json())
  .then(data => {
    
    const evento = data[0];

    document.getElementById("tituloEvento").textContent = evento.titulo;
    document.getElementById("localEvento").textContent = evento.local;
    document.getElementById("precoEvento").textContent = evento.preco;
    document.getElementById("tipoEvento").textContent = evento.tipo;
    document.getElementById("artistasEvento").textContent = evento.artistas;
  })
  .catch(error => {
    document.getElementById("tituloEvento").textContent = "Erro ao carregar evento.";
    console.error("Erro ao buscar JSON:", error);
  });
