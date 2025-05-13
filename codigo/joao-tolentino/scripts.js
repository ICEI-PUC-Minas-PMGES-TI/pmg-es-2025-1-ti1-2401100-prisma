// Máscara de telefone
const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length === 0) {
    e.target.value = "";
    return;
  }

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    value = value.replace(/^(\d*)/, "($1");
  }

  e.target.value = value;
});

// Validação de formulário
const form = document.querySelector(".conj-campos");
const nome = document.getElementById("nome");
const telefone = document.getElementById("telefone");
const email = form.querySelector('input[placeholder="Email"]');
const cidade = form.querySelector('input[placeholder="Cidade"]');
const genero = form.querySelector("select");

form.addEventListener("submit", function (e) {
    let valid = true;
  
    // Nome deve ter pelo menos 3 letras
    if (nome.value.trim().length < 3) {
      alert("O nome deve ter pelo menos 3 caracteres.");
      nome.focus();
      valid = false;
    }
  
    // Telefone deve ter 11 dígitos
    const telLimpo = telefone.value.replace(/\D/g, "");
    if (telLimpo.length !== 11) {
      alert("O telefone deve conter 11 dígitos (DDD + número).");
      telefone.focus();
      valid = false;
    }
  
    // Cidade deve conter apenas letras
    const cidadeValida = /^[A-Za-zÀ-ú\s]+$/.test(cidade.value.trim());
    if (!cidadeValida) {
      alert("A cidade deve conter apenas letras.");
      cidade.focus();
      valid = false;
    }
  
    // Email deve ser válido
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailValido) {
      alert("Por favor, insira um e-mail válido.");
      email.focus();
      valid = false;
    }
  
    // Gênero precisa estar selecionado
    if (genero.value === "disabled") {
      alert("Por favor, selecione um gênero.");
      genero.focus();
      valid = false;
    }
  
    if (!valid) {
      e.preventDefault();
      return;
    }
  
    e.preventDefault(); // Evita envio real do formulário
  
    // Objeto com os dados do usuário
    const usuario = {
      nome: nome.value.trim(),
      telefone: telefone.value.trim(),
      cidade: cidade.value.trim(),
      email: email.value.trim(),
      genero: genero.value
    };
  
    // Recupera array atual do localStorage (ou cria um novo)
    const usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios")) || [];
  
    // Adiciona o novo usuário ao array
    usuariosCadastrados.push(usuario);
  
    // Armazena novamente no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuariosCadastrados));
  
    // Opcional: Feedback + reset
    alert("Usuário cadastrado com sucesso!");
    form.reset();
  });
  