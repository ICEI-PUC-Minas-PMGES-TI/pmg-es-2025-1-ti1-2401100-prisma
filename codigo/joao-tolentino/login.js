document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('email').value.trim();
    if (!emailInput) {
        alert('Por favor, digite seu e-mail.');
        return;
    }

    // puxa a lista de usuários do Local Storage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Encontra um usuário com o e-mail fornecido
    const usuarioEncontrado = usuarios.find(u => u.email.toLowerCase() === emailInput.toLowerCase());

    if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogado', usuarioEncontrado.email);
        alert(`Bem-vindo(a) de volta, ${usuarioEncontrado.nome}!`);
        window.location.href = 'meuperfil.html';
    } else {
        alert('E-mail não encontrado. Verifique o e-mail digitado ou cadastre-se.');
    }
});