document.addEventListener("DOMContentLoaded", function () {
  AOS.init({ duration: 800, once: true });

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const emailLogado = localStorage.getItem("usuarioLogado");
  const profileContainer = document.querySelector(".profile-container");

  //Joga pra pag de login caso ninguem esteja logado
  if (!emailLogado) {
    alert("Nenhum usuário logado. Por favor, faça o login.");
    window.location.href = "login.html";
    return;
  }

  // Encontra o objeto completo do usuário logado
  const usuarioLogado = usuarios.find((u) => u.email === emailLogado);

  if (!usuarioLogado) {
    alert("Erro ao encontrar os dados do usuário. Faça o login novamente.");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
    return;
  }

  // Função para mostrar os dados no modo de visualização
  function exibirDados() {
    // Formata a data para DD/MM/AAAA
    const [ano, mes, dia] = usuarioLogado.dataNascimento
      ? usuarioLogado.dataNascimento.split("-")
      : ["", "", ""];
    const dataFormatada = dia ? `${dia}/${mes}/${ano}` : "Não informado";

    document.getElementById("profile-nome").textContent = usuarioLogado.nome;
    document.getElementById("profile-cidade").textContent =
      usuarioLogado.cidade;
    document.getElementById("profile-email").textContent = usuarioLogado.email;
    document.getElementById("profile-telefone").textContent =
      usuarioLogado.telefone;
    document.getElementById("profile-dataNascimento").textContent =
      dataFormatada;
    document.getElementById("profile-genero").textContent =
      usuarioLogado.genero;
    document.querySelector(
      ".profile-picture"
    ).style.backgroundImage = `url('${usuarioLogado.foto}')`;
  }

  // Modo de edição
  function modoEdicao() {
    profileContainer.innerHTML = `
            <div class="profile-header">
                <div class="profile-picture" style="background-image: url('${
                  usuarioLogado.foto
                }')"></div>
                <div class="profile-title">
                    <h2 id="profile-nome">${usuarioLogado.nome}</h2>
                </div>
            </div>
            <div class="profile-details-edit">
                <label>Nome:</label>
                <input type="text" id="edit-nome" value="${
                  usuarioLogado.nome
                }" required />
                
                <label>Data de Nascimento:</label>
                <input type="date" id="edit-dataNascimento" value="${
                  usuarioLogado.dataNascimento
                }" required />

                <label>Telefone:</label>
                <input type="text" id="edit-telefone" value="${
                  usuarioLogado.telefone
                }" required />

                <label>Cidade:</label>
                <input type="text" id="edit-cidade" value="${
                  usuarioLogado.cidade
                }" required />
                
                <label>Gênero:</label>
                <select id="edit-genero" required>
                    <option value="Masculino" ${
                      usuarioLogado.genero === "Masculino" ? "selected" : ""
                    }>Masculino</option>
                    <option value="Feminino" ${
                      usuarioLogado.genero === "Feminino" ? "selected" : ""
                    }>Feminino</option>
                    <option value="Prefiro não informar" ${
                      usuarioLogado.genero === "Prefiro não informar"
                        ? "selected"
                        : ""
                    }>Prefiro não informar</option>
                </select>

                <label>Email (não pode ser alterado):</label>
                <input type="email" id="edit-email" value="${
                  usuarioLogado.email
                }" disabled />
            </div>
            <div class="profile-actions">
                <button class="action-button cancel-button">Cancelar</button>
                <button class="action-button save-button">Salvar Alterações</button>
            </div>
        `;
    document
      .querySelector(".save-button")
      .addEventListener("click", salvarAlteracoes);
    document
      .querySelector(".cancel-button")
      .addEventListener("click", () => location.reload());
  }

  function salvarAlteracoes() {
    // Coleta os novos dados dos inputs
    const novosDados = {
      nome: document.getElementById("edit-nome").value.trim(),
      dataNascimento: document.getElementById("edit-dataNascimento").value,
      telefone: document.getElementById("edit-telefone").value.trim(),
      cidade: document.getElementById("edit-cidade").value.trim(),
      genero: document.getElementById("edit-genero").value,
    };

    // Validação simples
    if (!novosDados.nome || !novosDados.telefone || !novosDados.cidade) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const userIndex = usuarios.findIndex((u) => u.email === emailLogado);

    usuarios[userIndex] = { ...usuarios[userIndex], ...novosDados };

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Perfil atualizado com sucesso!");
    location.reload(); // Recarrega a página para mostrar os dados atualizados
  }

  exibirDados(); // Exibe os dados quando a página carrega

  document.querySelector(".edit-button").addEventListener("click", modoEdicao);
});
