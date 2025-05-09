fetch("https://raw.githubusercontent.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2025-1-ti1-2401100-prisma/refs/heads/master/mateus-armani/eventos.json")
  .then(response => response.json())
  .then(data => {
    // Pega o primeiro evento do array
    const evento = data[0];

    document.getElementById("titulo-evento").textContent = evento.nome;
    document.getElementById("local-evento").textContent = evento.local;
    document.getElementById("data-evento").textContent = evento.data;
    document.getElementById("horario-evento").textContent = evento.horario;
    document.getElementById("descricao-evento").textContent = evento.descricao;
  })
  .catch(error => {
    document.getElementById("titulo-evento").textContent = "Erro ao carregar evento.";
    console.error("Erro ao buscar JSON:", error);
  });
