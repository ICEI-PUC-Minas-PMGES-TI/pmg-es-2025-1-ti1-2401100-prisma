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

const storage = localStorage.getItem("eventos");

const storageParsed = storage ? JSON.parse(storage) : [];

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
  const artistas = localStorage.getItem("artistas");

  const artistasJSON = JSON.parse(artistas) || [];

  console.log(artistasJSON);

  artistasJSON.forEach((artista) => {
    const option = document.createElement("option");
    option.value = artista.nomeArtistico;
    option.textContent = `${artista.nomeArtistico}`;
    artistaSelect.appendChild(option);
  });
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

  if (dataInicio && dataFim && dataInicio > dataFim) {
    alert("A data de início não pode ser maior que a data de fim.");
    return;
  }

  if (dataInicio && dataFim && dataInicio < dataHoje) {
    alert("A data de início não pode ser menor que a data atual.");
    return;
  }

  if (!dataInicio || !dataFim) {
    alert("Por favor, preencha as datas de início e fim.");
    return;
  }

  gerarEventosMockados(dataHoje);
});

const dataTal = new Date(storageParsed.data);

function gerarEventosMockados(dataHoje) {
  const precoSelecionado = priceSelect.value;
  const dataInicioSelecionada = startDate.value;
  const dataFimSelecionada = endDate.value;

  console.log(dataInicioSelecionada);
  console.log(dataFimSelecionada);
  console.log(storageParsed.data);

  const eventosFiltrados = storageParsed.filter((ls) => {
    let condicaoPreco = true;
    switch (precoSelecionado) {
      case "menorcem":
        condicaoPreco = ls.preco < 100;
        break;
      case "entre-cem-dozentos":
        condicaoPreco = ls.preco >= 100 && ls.preco <= 200;
        break;
      case "entre-dozentos-trezentos":
        condicaoPreco = ls.preco > 200 && ls.preco <= 350;
        break;
      case "maior-que-trezentos":
        condicaoPreco = ls.preco > 350;
        break;
    }

    const dentroDoIntervalo =
      ls.data >= dataInicioSelecionada &&
      ls.data <= dataFimSelecionada &&
      ls.data >= dataHoje;

    const estadoFiltrado = ls.estado === Number(estadoSelect.value);

    const artistaFiltrado = ls.artistas.includes(artistaSelect.value);

    console.log(condicaoPreco, "eae");

    return (
      condicaoPreco && dentroDoIntervalo && estadoFiltrado && artistaFiltrado
    );
  });

  cardsWrapper.innerHTML = "";

  if (eventosFiltrados.length === 0) {
    cardsWrapper.innerHTML =
      "<p>Nenhum evento encontrado com os critérios selecionados.</p>";
    return;
  }

  console.log(eventosFiltrados);

  eventosFiltrados.forEach((evento) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const artistasTexto =
      Array.isArray(evento.artistas) && evento.artistas.length
        ? evento.artistas.join(", ")
        : "Não informado";

    const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    card.innerHTML = `
    <h3 style="text-align: center">${evento.titulo}</h3>
    <p><strong>Cidade:</strong> ${evento.cidade}</p>
    <p><strong>Data:</strong> ${dataFormatada}</p>
    <p><strong>Preço:</strong> R$ ${evento.preco.toFixed(2)}</p>
    <p><strong>Artista:</strong> ${artistasTexto}</p>
    <p><strong>Endereço:</strong> ${evento.endereco}</p>
  `;
    cardsWrapper.appendChild(card);
  });
}

carregarEstados();
carregarArtistasDoLocalStorage();
