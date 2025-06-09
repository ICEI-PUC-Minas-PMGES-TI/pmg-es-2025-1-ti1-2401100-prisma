const localizacaoSelect = document.querySelector("#localizacao-select");
const hourSelect = document.querySelector("#hour-select");
const priceSelect = document.querySelector("#price-select");
const startDate = document.querySelector("#data-inicio");
const endDate = document.querySelector("#data-fim");
const submitButton = document.querySelector("#submit-button");
const estadoSelect = document.querySelector("#estado-select");
const cardsWrapper = document.querySelector("#cards-wrapper");
const form = document.querySelector("#form-busca-eventos");
const artistaSelect = document.querySelector("#artista-select");

async function carregarEstados() {
  const response = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  );
  const estados = await response.json();
  estados.sort((a, b) => a.nome.localeCompare(b.nome));
  estados.forEach((estado) => {
    const option = document.createElement("option");
    option.value = estado.id;
    option.textContent = `${estado.nome} (${estado.sigla})`;
    estadoSelect.appendChild(option);
  });
}

estadoSelect.addEventListener("change", async function () {
  const estadoId = this.value;
  localizacaoSelect.innerHTML =
    '<option value="">Carregando cidades...</option>';
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`
  );
  const cidades = await response.json();
  localizacaoSelect.innerHTML = '<option value="">Selecionar Cidade</option>';
  cidades.forEach((cidade) => {
    const option = document.createElement("option");
    option.value = cidade.nome;
    option.textContent = cidade.nome;
    localizacaoSelect.appendChild(option);
  });
});

function carregarArtistasDoLocalStorage() {
  const artistasSalvos = JSON.parse(localStorage.getItem("eventos")).map(
    (evento) => {
      return evento.artistas;
    }
  );

  if (artistasSalvos) {
    try {
      const artistasArray = artistasSalvos;
      artistaSelect.innerHTML = '<option value="">Selecionar Artista</option>';
      artistasArray.forEach((artista) => {
        const option = document.createElement("option");
        option.value = artista;
        option.textContent = artista;
        artistaSelect.appendChild(option);
      });
    } catch (e) {
      console.error("Erro ao carregar artistas do localStorage:", e);
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dataInicio = startDate.value;
  const dataFim = endDate.value;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dataHoje = `${yyyy}-${mm}-${dd}`;

  if (!estadoSelect.value) {
    alert("Por favor, selecione um estado.");
    return;
  }

  if (!localizacaoSelect.value) {
    alert("Por favor, selecione uma cidade.");
    return;
  }

  if (
    (dataInicio && dataFim && dataInicio > dataFim) ||
    dataInicio < dataHoje
  ) {
    alert("A data de início não pode ser maior que a data de fim.");
    return;
  }

  if (!dataInicio || !dataFim) {
    alert("Por favor, preencha as datas de início e fim.");
    return;
  }

  gerarEventosMockados(dataHoje);
});

function gerarEventosMockados(dataHoje) {
  const precoSelecionado = priceSelect.value;
  const dataInicioSelecionada = startDate.value;
  const dataFimSelecionada = endDate.value;

  const eventosMock = [
    {
      nome: "Festival de Música",
      cidade: localizacaoSelect.value,
      horario: "20:00",
      preco: 150,
      data: startDate.value,
      artista: artistaSelect.value,
    },
    {
      nome: "Feira Cultural",
      cidade: localizacaoSelect.value,
      horario: "10:00",
      preco: 80,
      data: endDate.value,
      artista: artistaSelect.value,
    },
    {
      nome: "Stand-up Comedy",
      cidade: localizacaoSelect.value,
      horario: "19:30",
      preco: 120,
      data: startDate.value,
      artista: artistaSelect.value,
    },
    {
      nome: "Teatro Clássico",
      cidade: localizacaoSelect.value,
      horario: "18:00",
      preco: 220,
      data: endDate.value,
      artista: artistaSelect.value,
    },
    {
      nome: "Festival de Dança",
      cidade: localizacaoSelect.value,
      horario: "21:00",
      preco: 400,
      data: endDate.value,
      artista: artistaSelect.value,
    },
  ];

  const eventosFiltrados = eventosMock.filter((evento) => {
    let condicaoPreco = true;
    switch (precoSelecionado) {
      case "menorcem":
        condicaoPreco = evento.preco < 100;
        break;
      case "entre-cem-dozentos":
        condicaoPreco = evento.preco >= 100 && evento.preco <= 200;
        break;
      case "entre-dozentos-trezentos":
        condicaoPreco = evento.preco > 200 && evento.preco <= 350;
        break;
      case "maior-que-trezentos":
        condicaoPreco = evento.preco > 350;
        break;
    }

    const dentroDoIntervalo =
      evento.data >= dataInicioSelecionada &&
      evento.data <= dataFimSelecionada &&
      evento.data >= dataHoje;

    return condicaoPreco && dentroDoIntervalo;
  });

  cardsWrapper.innerHTML = "";

  if (eventosFiltrados.length === 0) {
    cardsWrapper.innerHTML =
      "<p>Nenhum evento encontrado com os critérios selecionados.</p>";
    return;
  }

  eventosFiltrados.forEach((evento) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
          <h3>${evento.nome}</h3>
          <p><strong>Cidade:</strong> ${evento.cidade}</p>
          <p><strong>Data:</strong> ${evento.data}</p>
          <p><strong>Horário:</strong> ${evento.horario}</p>
          <p><strong>Preço:</strong> R$ ${evento.preco.toFixed(2)}</p>
          <p><strong>Artista:</strong> ${evento.artista || "Não informado"}</p>
        `;
    cardsWrapper.appendChild(card);
  });
}

carregarEstados();
carregarArtistasDoLocalStorage();
