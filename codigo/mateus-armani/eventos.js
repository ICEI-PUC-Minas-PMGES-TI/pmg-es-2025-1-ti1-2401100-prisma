document.addEventListener("DOMContentLoaded", function () {
  console.log(
    "DOM totalmente carregado. Iniciando script eventos.js otimizado."
  );

  // --- 1. SELEÇÃO DOS ELEMENTOS ---
  const form = document.getElementById("evento-form");
  const campos = {
    titulo: document.getElementById("titulo"),
    estado: document.getElementById("estado-select"),
    cidade: document.getElementById("cidade-select"),
    rua: document.getElementById("rua"),
    numero: document.getElementById("numero"),
    bairro: document.getElementById("bairro"),
    descricao: document.getElementById("descricao"),
    preco: document.getElementById("preco"),
    tipo: document.getElementById("tipo"),
    artistas: document.getElementById("artistas"),
    promotor: document.getElementById("promotor"),
    data: document.getElementById("date"),
  };
  const mensagemErro = document.getElementById("mensagem-erro");

  const estadoSelect = campos.estado;
  const localizacaoSelect = campos.cidade;

  // --- 2. VERIFICAÇÃO DE DEPENDÊNCIAS ---
  if (
    typeof jQuery === "undefined" ||
    typeof jQuery.fn.select2 === "undefined"
  ) {
    console.error("ERRO: jQuery ou Select2 não estão carregados!");
    return;
  }

  // --- 3. INICIALIZAÇÃO DO SELECT2 ---
  if (campos.artistas) {
    $(campos.artistas).select2({
      placeholder: "Selecione ou digite os artistas",
      allowClear: true,
    });
  }

  if (campos.promotor) {
    $(campos.promotor).select2({
      placeholder: "Selecione ou digite os promotores",
      allowClear: true,
    });
  }

  if (campos.tipo) {
    $(campos.tipo).select2({
      placeholder: "Selecione o(s) tipo(s) de evento",
      allowClear: true,
    });
  }

  // --- 4. FUNÇÕES HELPER OTIMIZADAS ---
  function carregarOpcoesSelect(
    chaveLocalStorage,
    elementoSelect,
    propriedade,
    prefixo = ""
  ) {
    if (!elementoSelect) return;
    const dadosSalvos = localStorage.getItem(chaveLocalStorage);
    const dadosArray = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    const $select = $(elementoSelect);
    $select.empty();

    if (dadosArray.length === 0) {
      const texto =
        chaveLocalStorage === "artistas"
          ? "Nenhum artista cadastrado"
          : "Nenhum promotor cadastrado";
      $select.append(new Option(texto, "", true, true)).trigger("change");
    } else {
      dadosArray.forEach((item) => {
        const valorDaPropriedade = item[propriedade];
        if (valorDaPropriedade) {
          $select.append(
            new Option(prefixo + valorDaPropriedade, valorDaPropriedade)
          );
        }
      });
      $select.trigger("change");
    }
  }

  function persistirNovasTags(chaveLocalStorage, campoSelect, propriedade) {
    const selecionados = $(campoSelect).val() || [];
    const salvos = JSON.parse(localStorage.getItem(chaveLocalStorage)) || [];
    const nomesSalvos = salvos.map((item) => item[propriedade]);
    let novosAdicionados = false;

    selecionados.forEach((nomeItem) => {
      if (nomeItem && !nomesSalvos.includes(nomeItem)) {
        const novoObjeto = {};
        novoObjeto[propriedade] = nomeItem;
        salvos.push(novoObjeto);
        novosAdicionados = true;
      }
    });

    if (novosAdicionados) {
      localStorage.setItem(chaveLocalStorage, JSON.stringify(salvos));
    }
    return novosAdicionados;
  }

  // --- 5. CARREGAMENTO INICIAL DE DADOS ---
  carregarOpcoesSelect("artistas", campos.artistas, "nomeArtistico", "🟢 ");
  carregarOpcoesSelect("promotores", campos.promotor, "nome", "👨‍💼 ");

  // Remove a classe de erro ao interagir com o campo
  Object.values(campos).forEach((campo) => {
    if (!campo) return;
    if ($(campo).hasClass("select2-hidden-accessible")) {
      $(campo).on("change", () =>
        $(campo)
          .next(".select2-container")
          .find(".select2-selection")
          .removeClass("erro")
      );
    } else {
      campo.addEventListener("input", () => campo.classList.remove("erro"));
    }
  });

  // --- 7. LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    Object.values(campos).forEach((campo) => {
      if (!campo) return;
      const isSelect2 = $(campo).hasClass("select2-hidden-accessible");
      if (isSelect2) {
        const container = $(campo)
          .next(".select2-container")
          .find(".select2-selection");
        if (!$(campo).val() || $(campo).val().length === 0) {
          isValid = false;
          container.addClass("erro");
        } else {
          container.removeClass("erro");
        }
      } else if (campo.value.trim() === "") {
        isValid = false;
        campo.classList.add("erro");
      } else {
        campo.classList.remove("erro");
      }
    });

    if (!isValid) {
      mensagemErro.style.display = "block";
      return;
    }
    mensagemErro.style.display = "none";

    const novosArtistasAdicionados = persistirNovasTags(
      "artistas",
      campos.artistas,
      "nomeArtistico"
    );
    const novosPromotoresAdicionados = persistirNovasTags(
      "promotores",
      campos.promotor,
      "nome"
    );

    const endereco = `${campos.rua.value.trim()}, ${campos.numero.value.trim()} - ${campos.bairro.value.trim()}`;

    const evento = {
      id: "evento_" + Date.now(),
      titulo: campos.titulo.value.trim(),
      estado: Number(campos.estado.value.trim()),
      cidade: campos.cidade.value.trim(),
      endereco: endereco,
      descricao: campos.descricao.value.trim(),
      preco: Number(campos.preco.value.trim()),
      tipo: $(campos.tipo).val() || [],
      artistas: $(campos.artistas).val() || [],
      promotores: $(campos.promotor).val() || [],
      data: campos.data.value.trim(),
      dataCadastro: new Date().toISOString(),
    };

    try {
      const listaEventos = JSON.parse(localStorage.getItem("eventos")) || [];
      listaEventos.push(evento);
      localStorage.setItem("eventos", JSON.stringify(listaEventos));
    } catch (err) {
      console.error("Erro ao salvar evento no localStorage:", err);
      alert("Erro ao salvar o evento.");
      return;
    }

    alert("Evento cadastrado com sucesso!");
    form.reset();

    $(campos.artistas).val(null).trigger("change");
    $(campos.promotor).val(null).trigger("change");
    $(campos.tipo).val(null).trigger("change");

    if (novosArtistasAdicionados)
      carregarOpcoesSelect("artistas", campos.artistas, "nomeArtistico", "🟢 ");
    if (novosPromotoresAdicionados)
      carregarOpcoesSelect("promotores", campos.promotor, "nome", "👨‍💼 ");
  });

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
});
