document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM totalmente carregado. Iniciando script eventos.js.");

    const form = document.getElementById("evento-form");
    const campos = {
        titulo: document.getElementById("titulo"),
        local: document.getElementById("local"),
        endereco: document.getElementById("endereco"),
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
    console.log("jQuery e Select2 detectados. Inicializando campos Select2.");

    $(campos.artistas).select2({
        placeholder: "Selecione ou digite os artistas",
        allowClear: true,
        tags: true,
        tokenSeparators: [',', ' '],
        createTag: function (params) {
            if (params.term.trim() === '') {
                return null;
            }
            return {
                id: params.term.trim(),
                text: '⭐ ' + params.term.trim(),
                newTag: true
            };
        },
        templateResult: function (data) {
            if (data.newTag) {
                return $('<span>' + data.text + ' (novo artista)</span>');
            }
            return data.text;
        },
        templateSelection: function (data) {
            if (data.newTag) {
                return data.text.replace('⭐ ', '');
            }
            return data.text.replace('🟢 ', '');
        }
    });


    $(campos.promotor).select2({
        placeholder: "Selecione os promotores",
        allowClear: true,
    });

    $(campos.tipo).select2({
        placeholder: "Selecione o(s) tipo(s) de evento",
        allowClear: true,
    });
    console.log("Select2 inicializado para Artistas, Promotores e Tipo.");


    console.log("Configurando máscaras para Preço e Data.");
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

    campos.data.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2 && value.length <= 4) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        } else if (value.length > 4) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
        }
        e.target.value = value;
    });


    console.log("Configurando remoção de borda de erro.");
    for (const campoNome in campos) {
        const campoElement = campos[campoNome];

        if (campoElement.multiple) {
            $(campoElement).on('change', function () {
                if ($(this).val() && $(this).val().length > 0) {
                    $(this).next('.select2-container').find('.select2-selection').removeClass("erro");
                }
            });
            $(campoElement).on('select2:open', function () {
                $(this).next('.select2-container').find('.select2-selection').removeClass("erro");
            });
        } else {
            campoElement.addEventListener("input", function () {
                if (this.value.trim() !== "") {
                    this.classList.remove("erro");
                }
            });
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Formulário submetido. Iniciando validação.");
        let valid = true;
        let firstInvalidField = null;

        // Validação de todos os campos
        for (const campoNome in campos) {
            const campoElement = campos[campoNome];
            campoElement.classList.remove("erro");

            if (campoElement.multiple) {
                const select2Container = $(campoElement).next('.select2-container').find('.select2-selection');
                if (!$(campoElement).val() || $(campoElement).val().length === 0) {
                    select2Container.addClass("erro");
                    if (valid) {
                        firstInvalidField = select2Container;
                        valid = false;
                    }
                    console.log(`Campo Select2 "${campoNome}" inválido.`);
                } else {
                    select2Container.removeClass("erro");
                }
            } else {
                if (campoElement.value.trim() === "") {
                    campoElement.classList.add("erro");
                    if (valid) {
                        firstInvalidField = campoElement;
                        valid = false;
                    }
                    console.log(`Campo "${campoNome}" inválido.`);
                } else {
                    campoElement.classList.remove("erro");
                }
            }
        }

        if (!valid) {
            console.log("Validação falhou. Focando no primeiro campo inválido.");
            if (firstInvalidField) {
                if (firstInvalidField.hasClass('select2-selection')) {
                    firstInvalidField.find('.select2-search__field').focus();
                } else {
                    firstInvalidField.focus();
                }
            }
            return;
        }

        console.log("Formulário validado com sucesso. Montando objeto evento.");
        const evento = {
            titulo: campos.titulo.value.trim(),
            local: campos.local.value.trim(),
            endereco: campos.endereco.value.trim(),
            preco: campos.preco.value.trim(),
            tipo: Array.from($(campos.tipo).val() || []),
            artistas: ($(campos.artistas).val() || []).map(val => val.replace('🟢 ', '').replace('⭐ ', '')),
            promotor: Array.from($(campos.promotor).val() || []),
            data: campos.data.value.trim(),
            dataCadastro: new Date().toISOString()
        };
        console.log("Objeto evento criado:", evento);

        // --- Salvar no localStorage ---
        try {
            let listaEventos = JSON.parse(localStorage.getItem("eventos")) || [];
            console.log("Eventos existentes antes de adicionar:", listaEventos);
            listaEventos.push(evento);
            console.log("Eventos após adicionar o novo:", listaEventos);
            localStorage.setItem("eventos", JSON.stringify(listaEventos));
            console.log("Dados salvos no localStorage com a chave 'eventos'.");

            const storedData = localStorage.getItem("eventos");
            console.log("Conteúdo de 'eventos' no localStorage após salvamento:", storedData);
            if (storedData) {
                console.log("Parsed 'eventos' do localStorage:", JSON.parse(storedData));
            } else {
                console.warn("Chave 'eventos' não encontrada no localStorage após salvamento. Isso é inesperado.");
            }

        } catch (e) {
            console.error("ERRO ao salvar no localStorage:", e);
            alert("Ocorreu um erro ao salvar o evento. Verifique o console para mais detalhes.");
            return;
        }

        alert("Evento cadastrado com sucesso!");
        form.reset();


        $(campos.artistas).val(null).trigger('change');
        $(campos.promotor).val(null).trigger('change');
        $(campos.tipo).val(null).trigger('change');
        console.log("Formulário resetado e Select2 limpo.");
    });



    console.log("Tentando carregar artistas salvos.");
    const artistasSelect = campos.artistas;
    let artistasSalvos = localStorage.getItem("artistas");

    if (artistasSalvos) {
        try {
            const artistasArray = JSON.parse(artistasSalvos);
            $(artistasSelect).empty();
            artistasArray.forEach(artista => {
                if (!$(artistasSelect).find(`option[value="${artista}"]`).length) {
                    const option = document.createElement("option");
                    option.value = artista;
                    option.textContent = "🟢 " + artista;
                    artistasSelect.appendChild(option);
                }
            });
            $(artistasSelect).trigger('change');
            console.log("Artistas carregados e Select2 atualizado.");
        } catch (e) {
            console.error("ERRO ao carregar artistas do localStorage:", e);
        }
    } else {
        console.log("Nenhum artista salvo encontrado no localStorage.");
    }
});