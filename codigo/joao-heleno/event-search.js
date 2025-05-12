document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-busca-eventos");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const localizacao = document.querySelector(
      'select[name="localizacao"]'
    ).value;
    const horario = document.querySelector('select[name="hour"]').value;
    const preco = document.querySelector('select[name="price"]').value;
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;

    console.log("Localização:", localizacao);
    console.log("Horário:", horario);
    console.log("Preço:", preco);
    console.log("Data de Início:", dataInicio);
    console.log("Data de Fim:", dataFim);
  });

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  if (inicio > fim) {
    console.error("A data de início não pode ser maior que a data de fim.");
    return false;
  }
});
