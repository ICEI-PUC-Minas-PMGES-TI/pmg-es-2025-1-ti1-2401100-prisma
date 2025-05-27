const localizacaoSelect = document.querySelector("#localizacao-select");
const hourSelect = document.querySelector("#hour-select");
const priceSelect = document.querySelector("#price-select");
const startDate = document.querySelector("#data-inicio");
const endDate = document.querySelector("#data-fim");
const submitButton = document.querySelector("#submit-button");
const estadoSelect = document.querySelector("#estado-select");

const form = document.querySelector("#form-busca-eventos");

async function carregarEstados() {
  const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
  const estados = await response.json();

  estados.sort((a, b) => a.nome.localeCompare(b.nome));

  estados.forEach(estado => {
    const option = document.createElement("option");
    option.value = estado.id;
    option.textContent = `${estado.nome} (${estado.sigla})`;
    estadoSelect.appendChild(option);
  });
}

estadoSelect.addEventListener("change", async function () {
  const estadoId = this.value;
  localizacaoSelect.innerHTML = '<option value="">Carregando cidades...</option>';

  const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`);
  const cidades = await response.json();

  localizacaoSelect.innerHTML = '<option value="">Selecionar Cidade</option>';
  cidades.forEach(cidade => {
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
});
