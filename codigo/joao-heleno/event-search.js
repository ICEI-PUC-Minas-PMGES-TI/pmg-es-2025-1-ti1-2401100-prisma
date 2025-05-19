document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-busca-eventos");
  const cardsWrapper = document.getElementById("cards-wrapper");

  let eventos = [];
  fetch("eventos.json")
    .then((r) => r.json())
    .then((data) => {
      eventos = data;
      renderCards(eventos);
    });

  function renderCards(lista) {
    cardsWrapper.innerHTML = "";
    lista.forEach((ev) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${ev.titulo}</h3><p>R$ ${ev.preco}</p>`;
      cardsWrapper.appendChild(div);
    });
    if (!lista.length) {
      cardsWrapper.innerHTML = "<p>Nenhum evento encontrado.</p>";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const priceSel = form.price.value;

    const filtrados = eventos.filter((ev) => {
      if (!priceSel) return true;

      const precoNum = ev.preco === "Gratuito" ? 0 : parseFloat(ev.preco);

      switch (priceSel) {
        case "menorcem":
          return precoNum < 100;
        case "entre-cem-dozentos":
          return precoNum >= 100 && precoNum <= 200;
        case "entre-dozentos-trezentos":
          return precoNum >= 201 && precoNum <= 350;
        case "maior-que-trezentos":
          return precoNum > 350;
        default:
          return true;
      }
    });

    renderCards(filtrados);
  });
});
