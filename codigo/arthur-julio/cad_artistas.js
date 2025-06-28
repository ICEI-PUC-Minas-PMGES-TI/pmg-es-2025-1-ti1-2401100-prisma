// cad_artistas.js

// Função para validar URLs
function validaURL(url) {
    // Se a URL estiver vazia, considera válida (a não ser que seja um campo obrigatório tratado em outro lugar)
    if (!url) return true;
    try {
        new URL(url); // Tenta criar um objeto URL
        return true; // Se conseguir, a URL é válida
    } catch {
        return false; // Se der erro, a URL é inválida
    }
}

// Função para validar telefones brasileiros (com DDD, 8 ou 9 dígitos)
function validaTelefone(tel) {
    // Regex para telefone brasileiro com DDD, aceita formatos como (xx) xxxx-xxxx ou (xx) xxxxx-xxxx
    // Adicionado ? para o hífen, tornando-o opcional
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return regex.test(tel); // Testa se o telefone corresponde ao padrão
}

/**
 * Função genérica para validar um formulário.
 * Adiciona a classe 'erro' aos campos inválidos.
 * @param {HTMLFormElement} formElement O elemento do formulário a ser validado.
 * @returns {boolean} True se o formulário for válido, False caso contrário.
 */
function validaFormulario(formElement) {
    const campos = formElement.querySelectorAll("input, select, textarea");
    // Remove a classe 'erro' de todos os campos antes de revalidar
    campos.forEach(campo => campo.classList.remove("erro"));

    let valido = true; // Variável para controlar a validade geral do formulário

    // Lista de campos obrigatórios que devem ser preenchidos
    // 'genero' foi substituído por 'generoMusical' e 'generoArtistico' foi removido
    const camposObrigatorios = [
        "nomePessoa", "generoPessoa", "dataNascimento", "nomeArtistico",
        "descricao", "generoMusical", "foto", "tipoEspetaculo",
        "anoFundacao", "qtdIntegrantes", "cidade", "telefone"
    ];

    // Itera sobre os campos obrigatórios e verifica se estão vazios
    camposObrigatorios.forEach(campoNome => {
        const campo = formElement[campoNome];
        if (!campo) {
            console.warn(`Campo '${campoNome}' não encontrado no formulário.`);
            return; // Pula se o campo não existir
        }

        // Para inputs de arquivo, a validação de .value.trim() não é adequada.
        // Verificamos se há arquivos selecionados.
        if (campo.type === "file") {
            if (campo.files.length === 0) {
                valido = false;
                campo.classList.add("erro");
            }
        }
        // Validação para selects simples e outros inputs (text, number, textarea, date)
        else {
            if (!campo.value.trim()) {
                valido = false;
                campo.classList.add("erro");
            }
        }
    });

    // Validação da URL da foto (REMOVIDA, pois é um input type="file" e não URL)
    // A checagem de obrigatoriedade já é feita em camposObrigatorios para `foto`
    // if (formElement.foto && (!formElement.foto.value.trim() || !validaURL(formElement.foto.value))) {
    //     valido = false;
    //     formElement.foto.classList.add("erro");
    // }

    // Validação do Ano de Fundação (deve estar entre 1900 e 2025)
    // Usar parseInt para garantir que a comparação seja numérica
    const anoFundacaoValue = parseInt(formElement.anoFundacao.value);
    if (formElement.anoFundacao && (isNaN(anoFundacaoValue) || anoFundacaoValue < 1900 || anoFundacaoValue > 2025)) {
        valido = false;
        formElement.anoFundacao.classList.add("erro");
    }

    // Validação da Quantidade de Integrantes (maior ou igual a 1)
    // Usar parseInt para garantir que a comparação seja numérica
    const qtdIntegrantesValue = parseInt(formElement.qtdIntegrantes.value);
    if (formElement.qtdIntegrantes && (isNaN(qtdIntegrantesValue) || qtdIntegrantesValue < 1)) {
        valido = false;
        formElement.qtdIntegrantes.classList.add("erro");
    }

    // Validação do Telefone (obrigatório e formato válido)
    if (formElement.telefone && (!formElement.telefone.value.trim() || !validaTelefone(formElement.telefone.value.trim()))) {
        valido = false;
        formElement.telefone.classList.add("erro");
    }

    // Validação para URLs opcionais (se preenchidas, devem ser válidas)
    const camposURLOpcionais = ["spotify", "instagram", "youtube", "facebook"];
    camposURLOpcionais.forEach(campoNome => {
        const campo = formElement[campoNome];
        if (campo && campo.value.trim() && !validaURL(campo.value)) {
            valido = false;
            campo.classList.add("erro");
        }
    });

    return valido;
}