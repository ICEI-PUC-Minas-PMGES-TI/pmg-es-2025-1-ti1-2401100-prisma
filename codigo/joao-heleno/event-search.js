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
  });

  if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
    alert("A data de início não pode ser maior que a data de fim.");
    return;
  }

  const filtrosSelecionados = {
    localizacao,
    horario,
    preco,
    dataInicio,
    dataFim,
    geradoEm: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(filtrosSelecionados, null, 2);

  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "search-eventos.json";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("JSON gerado:", jsonStr);
});
