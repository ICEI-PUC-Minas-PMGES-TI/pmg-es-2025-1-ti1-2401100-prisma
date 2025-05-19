document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-busca-eventos");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); 

    const localizacao = form.localizacao.value;
    const horario = form.hour.value;
    const preco = form.price.value;
    const dataInicio = form["data-evento"].value;
    const dataFim = form["data-evento-fim"].value;

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
    a.download = "filtros-eventos.json";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("JSON gerado:", jsonStr);
  });
});
