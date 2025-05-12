// cadastroValidation.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.querySelector("#nome");
    const email = document.querySelector("#email");
    const telefone = document.querySelector("#telefone");
    const estilo = document.querySelector("#estilo");
    const localizacao = document.querySelector("#localizacao");

    if (
      !nome.value.trim() ||
      !email.value.trim() ||
      !telefone.value.trim() ||
      !estilo.value.trim() ||
      !localizacao.value.trim()
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    alert("Cadastro realizado com sucesso! 🎉");
    form.reset();
  });
});
