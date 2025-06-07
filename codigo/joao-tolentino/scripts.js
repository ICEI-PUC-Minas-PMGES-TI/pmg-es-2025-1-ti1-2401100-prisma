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

// ... (todo o código anterior do seu scripts.js) ...

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    // ... (código para buscar a foto) ...
    let fotoPerfil = "";
    try {
        const res = await fetch("https://randomuser.me/api/");
        const data = await res.json();
        fotoPerfil = data.results[0].picture.large;
    } catch (err) {
        console.error("Erro ao buscar imagem de perfil:", err);
        fotoPerfil = "https://via.placeholder.com/150"; // fallback
    }

    const usuario = {
        nome: nome.value.trim(),
        // Adicionei a data de nascimento que estava faltando no objeto
        dataNascimento: document.getElementById("dataNascimento").value, 
        telefone: telefone.value.trim(),
        cidade: cidade.value.trim(),
        email: email.value.trim(),
        genero: genero.value,
        foto: fotoPerfil
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

    // --- NOVA PARTE ---
    // Loga o usuário automaticamente após o cadastro
    localStorage.setItem('usuarioLogado', usuario.email);

    alert("Usuário cadastrado com sucesso! Você será direcionado para o seu perfil.");
    // Redireciona para a página de perfil
    window.location.href = 'meuperfil.html';
});

// ... (resto do seu código, como a função validarFormulario) ...

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
