document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-artista");

  function validaURL(url) {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function validaTelefone(tel) {
    // Regex para telefone brasileiro com DDD, aceita formatos como (xx) xxxx-xxxx ou (xx) xxxxx-xxxx
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return regex.test(tel);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const campos = form.querySelectorAll("input, select, textarea");
    campos.forEach(campo => campo.classList.remove("erro"));

    let valido = true;

    if (!form.nomePessoa.value.trim()) {
      valido = false;
      form.nomePessoa.classList.add("erro");
    }

    if (!form.generoPessoa.value) {
      valido = false;
      form.generoPessoa.classList.add("erro");
    }

    if (!form.dataNascimento.value) {
      valido = false;
      form.dataNascimento.classList.add("erro");
    }

    if (!form.nomeArtistico.value.trim()) {
      valido = false;
      form.nomeArtistico.classList.add("erro");
    }

    if (!form.descricao.value.trim()) {
      valido = false;
      form.descricao.classList.add("erro");
    }

    if (!form.genero.value.trim()) {
      valido = false;
      form.genero.classList.add("erro");
    }

    if (!form.foto.value.trim() || !validaURL(form.foto.value)) {
      valido = false;
      form.foto.classList.add("erro");
    }

    if (!form.tipoEspetaculo.value) {
      valido = false;
      form.tipoEspetaculo.classList.add("erro");
    }

    if (!form.anoFundacao.value || form.anoFundacao.value < 1900 || form.anoFundacao.value > 2025) {
      valido = false;
      form.anoFundacao.classList.add("erro");
    }

    if (!form.qtdIntegrantes.value || form.qtdIntegrantes.value < 1) {
      valido = false;
      form.qtdIntegrantes.classList.add("erro");
    }

    if (!form.cidade.value.trim()) {
      valido = false;
      form.cidade.classList.add("erro");
    }

    if (!form.telefone.value.trim() || !validaTelefone(form.telefone.value.trim())) {
      valido = false;
      form.telefone.classList.add("erro");
    }

    if (!form.generoArtistico.value.trim()) {
      valido = false;
      form.generoArtistico.classList.add("erro");
    }

    const camposURL = ["spotify", "instagram", "youtube", "facebook"];
    camposURL.forEach(campoNome => {
      const campo = form[campoNome];
      if (campo.value.trim() && !validaURL(campo.value)) {
        valido = false;
        campo.classList.add("erro");
      }
    });

    if (!valido) {
      alert("Por favor, preencha os campos obrigatórios corretamente.");
      return;
    }

    alert("Artista cadastrado com sucesso!");
    form.reset();
  });
});
