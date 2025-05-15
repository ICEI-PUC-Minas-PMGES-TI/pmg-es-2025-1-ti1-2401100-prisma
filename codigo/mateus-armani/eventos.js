const form = document.getElementById("evento-form");
const campos = {
    titulo: document.getElementById("titulo"),
    local: document.getElementById("local"),
    endereco: document.getElementById("endereco"),
    preco: document.getElementById("preco"),
    tipo: document.getElementById("tipo"),
    artistas: document.getElementById("artistas"),
    promotor: document.getElementById("promotor"),
};

// Máscara para o campo de Preço 
campos.preco.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length < 3) {
        valor = valor.padStart(3, "0");
    }
    valor = (parseInt(valor, 10) / 100).toFixed(2);
    valor = valor.replace(".", ",");
    valor = "R$ " + valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    e.target.value = valor;
});


for (const campo in campos) {
    campos[campo].addEventListener("input", function () {
        if (this.value.trim() !== "") {
            this.classList.remove("erro");
        }
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    for (const campo in campos) {
        campos[campo].classList.remove("erro");
        if (campos[campo].value.trim() === "") {
            campos[campo].classList.add("erro");
            if (valid) campos[campo].focus();
            valid = false;
        }
    }

    if (!valid) return;

    const evento = {
        titulo: campos.titulo.value.trim(),
        local: campos.local.value.trim(),
        endereco: campos.endereco.value.trim(),
        preco: campos.preco.value.trim(),
        tipo: campos.tipo.value,
        artistas: campos.artistas.value.trim(),
        promotor: campos.promotor.value.trim(),
        dataCadastro: new Date().toISOString()
    };

    let listaEventos = JSON.parse(localStorage.getItem("eventos")) || [];
    listaEventos.push(evento);
    localStorage.setItem("eventos", JSON.stringify(listaEventos));

    alert("Evento cadastrado com sucesso!");
    form.reset();
});
