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
    // Nota: Certifique-se de que o campo 'telefone' existe no seu HTML, pois ele está na sua validação.
    const camposObrigatorios = [
        "nomePessoa", "generoPessoa", "dataNascimento", "nomeArtistico",
        "descricao", "genero", "foto", "tipoEspetaculo",
        "anoFundacao", "qtdIntegrantes", "cidade", "telefone", "generoArtistico"
    ];

    // Itera sobre os campos obrigatórios e verifica se estão vazios
    camposObrigatorios.forEach(campoNome => {
        const campo = formElement[campoNome];
        // Verifica se o campo existe no formulário e se seu valor está vazio (após remover espaços)
        if (campo && !campo.value.trim()) {
            valido = false; // Define o formulário como inválido
            campo.classList.add("erro"); // Adiciona a classe 'erro' para estilização visual
        }
    });

    // Validações específicas para campos que precisam de formato
    // Validação da URL da foto (obrigatória e deve ser uma URL válida)
    if (formElement.foto && (!formElement.foto.value.trim() || !validaURL(formElement.foto.value))) {
        valido = false;
        formElement.foto.classList.add("erro");
    }

    // Validação do Ano de Fundação (deve ser um número dentro do intervalo)
    if (formElement.anoFundacao && (formElement.anoFundacao.value < 1900 || formElement.anoFundacao.value > 2025)) {
        valido = false;
        formElement.anoFundacao.classList.add("erro");
    }

    // Validação da Quantidade de Integrantes (deve ser um número maior ou igual a 1)
    if (formElement.qtdIntegrantes && formElement.qtdIntegrantes.value < 1) {
        valido = false;
        formElement.qtdIntegrantes.classList.add("erro");
    }

    // Validação do Telefone (obrigatório e deve seguir o padrão brasileiro)
    if (formElement.telefone && (!formElement.telefone.value.trim() || !validaTelefone(formElement.telefone.value.trim()))) {
        valido = false;
        formElement.telefone.classList.add("erro");
    }

    // Validação para campos de URL opcionais (se preenchidos, devem ser URLs válidas)
    const camposURLOpcionais = ["spotify", "instagram", "youtube", "facebook"];
    camposURLOpcionais.forEach(campoNome => {
        const campo = formElement[campoNome];
        // Se o campo existe, não está vazio e a URL é inválida
        if (campo && campo.value.trim() && !validaURL(campo.value)) {
            valido = false;
            campo.classList.add("erro");
        }
    });

    return valido; // Retorna o resultado final da validação
}