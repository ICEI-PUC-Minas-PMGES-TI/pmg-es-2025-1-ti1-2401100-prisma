// cad_artistas.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form-artista");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nomePessoa = document.querySelector("#nomePessoa");
    const nomeArtistico = document.querySelector("#nomeArtistico");

    if (!nomePessoa.value.trim() || !nomeArtistico.value.trim()) {
      alert("Por favor, preencha o nome completo e o nome artístico.");
      return;
    }

    const nomeArtisticoValue = nomeArtistico.value.trim();
    let artistasSalvos = localStorage.getItem("artistas");
    artistasSalvos = artistasSalvos ? JSON.parse(artistasSalvos) : [];

    if (!artistasSalvos.includes(nomeArtisticoValue)) {
      artistasSalvos.push(nomeArtisticoValue);
      localStorage.setItem("artistas", JSON.stringify(artistasSalvos));
      alert(`Artista "${nomeArtisticoValue}" cadastrado com sucesso! 🎉`);
    } else {
      alert(`O artista "${nomeArtisticoValue}" já está cadastrado.`);
    }

    form.reset();
  });
});