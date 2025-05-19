// ------------------- Máscara de telefone -------------------
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

// ------------------- Validação e Cadastro -------------------
const form = document.querySelector(".conj-campos");
const nome = document.getElementById("nome");
const telefone = document.getElementById("telefone");
const email = document.getElementById("email");
const cidade = document.getElementById("cidade");
const genero = document.getElementById("genero");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validarFormulario()) return;

  const usuario = {
    nome: nome.value.trim(),
    telefone: telefone.value.trim(),
    cidade: cidade.value.trim(),
    email: email.value.trim(),
    genero: genero.value
  };

  const usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios")) || [];

  const emailJaExiste = usuariosCadastrados.some(
    (u) => u.email.toLowerCase() === usuario.email.toLowerCase()
  );

  if (emailJaExiste) {
    alert("Este e-mail já está cadastrado.");
    email.focus();
    return;
  }

  usuariosCadastrados.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuariosCadastrados));

  alert("Usuário cadastrado com sucesso!");
  form.reset();
});

// ------------------- Função de Validação -------------------
function validarFormulario() {
  let valid = true;

  if (nome.value.trim().length < 3) {
    alert("O nome deve ter pelo menos 3 caracteres.");
    nome.focus();
    valid = false;
  }

  const telLimpo = telefone.value.replace(/\D/g, "");
  if (telLimpo.length !== 11) {
    alert("O telefone deve conter 11 dígitos (DDD + número).");
    telefone.focus();
    valid = false;
  }

  const cidadeValida = /^[A-Za-zÀ-ú\s]+$/.test(cidade.value.trim());
  if (!cidadeValida) {
    alert("A cidade deve conter apenas letras.");
    cidade.focus();
    valid = false;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  if (!emailValido) {
    alert("Por favor, insira um e-mail válido.");
    email.focus();
    valid = false;
  }

  if (genero.value === "disabled") {
    alert("Por favor, selecione um gênero.");
    genero.focus();
    valid = false;
  }

  return valid;
}
