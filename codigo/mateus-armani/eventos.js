document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM totalmente carregado. Iniciando script eventos.js.");

    const form = document.getElementById("evento-form");
    const campos = {
        titulo: document.getElementById("titulo"),
        estado: document.getElementById("estado"),
        cidade: document.getElementById("cidade"),
        endereco: document.getElementById("endereco"),
        descricao: document.getElementById("descrição"),
        preco: document.getElementById("preco"),
        tipo: document.getElementById("tipo"),
        artistas: document.getElementById("artistas"),
        promotor: document.getElementById("promotor"),
        data: document.getElementById("data")
    };

    if (typeof jQuery === 'undefined' || typeof jQuery.fn.select2 === 'undefined') {
        console.error("ERRO: jQuery ou Select2 não estão carregados! Verifique a ordem dos scripts no HTML.");
        return;
    }

    $(campos.artistas).select2({
        placeholder: "Selecione ou digite os artistas",
        allowClear: true,
        tags: true,
        tokenSeparators: [',', ' '],
        createTag: function (params) {
            if (params.term.trim() === '') return null;
            return {
                id: params.term.trim(),
                text: '⭐ ' + params.term.trim(),
                newTag: true
            };
        },
        templateResult: function (data) {
            return data.newTag
                ? $('<span>' + data.text + ' (novo artista)</span>')
                : data.text;
        },
        templateSelection: function (data) {
            return data.text.replace('⭐ ', '').replace('🟢 ', '');
        }
    });

    $(campos.promotor).select2({ placeholder: "Selecione os promotores", allowClear: true });
    $(campos.tipo).select2({ placeholder: "Selecione o(s) tipo(s) de evento", allowClear: true });

    campos.preco.addEventListener("input", function (e) {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.padStart(3, "0");
        valor = (parseInt(valor, 10) / 100).toFixed(2);
        valor = "R$ " + valor.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        e.target.value = valor;
    });

    campos.data.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2 && value.length <= 4)
            value = value.slice(0, 2) + '/' + value.slice(2);
        else if (value.length > 4)
            value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
        e.target.value = value;
    });

    for (const campoNome in campos) {
        const campo = campos[campoNome];
        if (campo.multiple) {
            $(campo).on('change select2:open', function () {
                $(this).next('.select2-container').find('.select2-selection').removeClass("erro");
            });
        } else {
            campo.addEventListener("input", function () {
                if (this.value.trim() !== "") this.classList.remove("erro");
            });
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let valid = true;
        let firstInvalidField = null;

        const mensagemErro = document.getElementById("mensagem-erro");
        mensagemErro.style.display = "none";

        for (const campoNome in campos) {
            const campo = campos[campoNome];
            if (campo.multiple) {
                const container = $(campo).next('.select2-container').find('.select2-selection');
                if (!$(campo).val() || $(campo).val().length === 0) {
                    container.addClass("erro");
                    if (valid) firstInvalidField = container;
                    valid = false;
                } else {
                    container.removeClass("erro");
                }
            } else {
                if (campo.value.trim() === "") {
                    campo.classList.add("erro");
                    if (valid) firstInvalidField = campo;
                    valid = false;
                } else {
                    campo.classList.remove("erro");
                }
            }
        }

        if (!valid) {
            mensagemErro.style.display = "block";
            if (firstInvalidField) {
                if (firstInvalidField.hasClass?.('select2-selection')) {
                    firstInvalidField.find('.select2-search__field').focus();
                } else {
                    firstInvalidField.focus();
                }
            }
            return;
        }

        mensagemErro.style.display = "none";

        const evento = {
            titulo: campos.titulo.value.trim(),
            estado: campos.estado.value.trim(),
            cidade: campos.cidade.value.trim(),
            endereco: campos.endereco.value.trim(),
            descricao: campos.descricao.value.trim(),
            preco: campos.preco.value.trim(),
            tipo: Array.from($(campos.tipo).val() || []),
            artistas: ($(campos.artistas).val() || []).map(val => val.replace('🟢 ', '').replace('⭐ ', '')),
            promotor: Array.from($(campos.promotor).val() || []),
            data: campos.data.value.trim(),
            dataCadastro: new Date().toISOString()
        };

        try {
            const listaEventos = JSON.parse(localStorage.getItem("eventos")) || [];
            listaEventos.push(evento);
            localStorage.setItem("eventos", JSON.stringify(listaEventos));
        } catch (e) {
            console.error("Erro ao salvar no localStorage:", e);
            alert("Erro ao salvar o evento.");
            return;
        }

        alert("Evento cadastrado com sucesso!");
        form.reset();
        $(campos.artistas).val(null).trigger('change');
        $(campos.promotor).val(null).trigger('change');
        $(campos.tipo).val(null).trigger('change');
    });

    // Carregar artistas do localStorage
    const artistasSelect = campos.artistas;
    const artistasSalvos = localStorage.getItem("artistas");

    if (artistasSalvos) {
        try {
            const artistasArray = JSON.parse(artistasSalvos);
            $(artistasSelect).empty();
            artistasArray.forEach(artista => {
                if (!$(artistasSelect).find(`option[value="${artista}"]`).length) {
                    const option = new Option("🟢 " + artista, artista);
                    artistasSelect.appendChild(option);
                }
            });
            $(artistasSelect).trigger('change');
        } catch (e) {
            console.error("Erro ao carregar artistas:", e);
        }
    }
});
