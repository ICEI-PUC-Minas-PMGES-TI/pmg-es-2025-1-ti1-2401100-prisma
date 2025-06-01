const localizacaoSelect = document.querySelector("#localizacao-select");
const hourSelect = document.querySelector("#hour-select");
const priceSelect = document.querySelector("#price-select");
const startDate = document.querySelector("#data-inicio");
const endDate = document.querySelector("#data-fim");
const submitButton = document.querySelector("#submit-button");
const estadoSelect = document.querySelector("#estado-select");
const cardsWrapper = document.querySelector("#cards-wrapper");

const form = document.querySelector("#form-busca-eventos");

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

carregarEstados();

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

  gerarEventosMockados(); // Chama a função que exibe os eventos mockados
});

function gerarEventosMockados() {
  const precoSelecionado = priceSelect.value;

  // Lista de eventos mockados com valor real
  const eventosMock = [
    {
      nome: "Festival de Música",
      cidade: localizacaoSelect.value,
      horario: "20:00",
      preco: 150,
      data: startDate.value,
    },
    {
      nome: "Feira Cultural",
      cidade: localizacaoSelect.value,
      horario: "10:00",
      preco: 80,
      data: endDate.value,
    },
    {
      nome: "Stand-up Comedy",
      cidade: localizacaoSelect.value,
      horario: "19:30",
      preco: 120,
      data: startDate.value,
    },
    {
      nome: "Teatro Clássico",
      cidade: localizacaoSelect.value,
      horario: "18:00",
      preco: 220,
      data: endDate.value,
    },
    {
      nome: "Festival de Dança",
      cidade: localizacaoSelect.value,
      horario: "21:00",
      preco: 400,
      data: endDate.value,
    },
  ];

  // Filtrar eventos com base no filtro de preço
  const eventosFiltrados = eventosMock.filter((evento) => {
    switch (precoSelecionado) {
      case "menorcem":
        return evento.preco < 100;
      case "entre-cem-dozentos":
        return evento.preco >= 100 && evento.preco <= 200;
      case "entre-dozentos-trezentos":
        return evento.preco > 200 && evento.preco <= 350;
      case "maior-que-trezentos":
        return evento.preco > 350;
      default:
        return true; // Nenhum filtro de preço aplicado
    }
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
    `;

    cardsWrapper.appendChild(card);
  });
}
