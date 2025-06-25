// FIXME - let latitude;
// let longitude;

// Adicionando API key e inicializando o mapa com valores padrão
mapboxgl.accessToken =
  "pk.eyJ1IjoicGVkcm9yZXNlbmRlLXB1Y21pbmFzIiwiYSI6ImNtYWJqN3p5ZjJjMG8ybXE5aTE4dnM4eWkifQ.2c_APoZ5J8IMH2ZWQy-zpw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v11", // streets-v9
  zoom: 2,
  center: [0, 0],
});

map.addControl(new mapboxgl.NavigationControl()); // Opcional

// Lista de markers atuais para serem removidos entre filtragens
const markers = [];

// Declarando a fórmula de Haversine, usada para calcular a distância entre dois pontos na superficie da Terra
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Funcionalidade de busca de endereço no Mapbox Geocoding API

async function geocodeEndereco(endereco) {
  const query = encodeURIComponent(endereco);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.features.length > 0) {
    return data.features[0].center; // [longitude, latitude]
  }

  return null;
}

async function getLocationByIP() {
  try {
    const response = await fetch("https://ipapi.co/json/"); // basic video to help: https://youtu.be/g5tNE7-vkGk
    const data = await response.json();

    return {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    };
  } catch (error) {
    console.error("Erro ao obter localização por IP:", err);
    return null;
  }
}

// Função que gera o pop-up card de um evento ao clicar no respectivo pin no mapa
function gerarPopupCardMapa(evento) {
  const data = new Date(evento.data);
  const dataFormatada = data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const endereco = `${evento.local.endereco}, ${evento.local.cidade} - ${evento.local.estado}`;

  return `
    <div class="popup-card">
      <h3>${evento.titulo}</h3>
      <p><strong>Data:</strong> ${dataFormatada}</p>
      <p><strong>Endereço:</strong> ${endereco}</p>
      <p><strong>Preço:</strong> ${evento.preco}</p>
      <p><a href="#">Detalhes</a></p>
    </div>
  `;
}

function limparMarkers() {
  markers.forEach((marker) => marker.remove());
  markers.length = 0; // esvazia o array mantendo a referência
}

// Função que carrega os eventos do JSON e bota no mapa
async function carregarEventos(userLat, userLon, filtros = {}) {
  limparMarkers();

  const response = await fetch("data/eventos.json");
  const eventos = await response.json();

  for (const evento of eventos) {
    let coords = evento.geolocalizacao;

    if (!coords || coords.length !== 2) {
      const enderecoCompleto = `${evento.local.endereco}, ${evento.local.cidade}, ${evento.local.estado}`;
      coords = await geocodeEndereco(enderecoCompleto);
      if (coords) evento.geolocalizacao = coords;
    }

    if (coords) {
      const [lon, lat] = coords;
      const distancia = haversineDistance(userLat, userLon, lat, lon);

      // Aplicação dos filtros
      if (
        (filtros.tipo && evento.tipo !== filtros.tipo) ||
        (filtros.categoria && evento.categoria !== filtros.categoria) ||
        (filtros.precoMax && evento.preco > filtros.precoMax) ||
        (filtros.dataMax &&
          new Date(evento.data) > new Date(filtros.dataMax)) ||
        (filtros.distanciaMax && distancia > filtros.distanciaMax)
      ) {
        continue;
      }

      const marker = new mapboxgl.Marker({ color: "#ff5e5e" })
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setHTML(gerarPopupCardMapa(evento)))
        .addTo(map);

      markers.push(marker);
    }
  }
}

// Obtendo a posição atual do usuário com Geolocation API (https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) (requer permissão do usuário para acessar sua geolocalização)
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      async () => {
        const ipCoords = await getLocationByIP();
        if (ipCoords) resolve(ipCoords);
        else reject("Não foi possível obter localização");
      }
    );
  });
}

// Inicializando

let userLatitude, userLongitude;

(async () => {
  try {
    const coords = await getUserLocation();
    userLatitude = coords.latitude;
    userLongitude = coords.longitude;

    map.setCenter([userLongitude, userLatitude]);
    map.setZoom(12.5);

    new mapboxgl.Marker()
      .setLngLat([userLongitude, userLatitude])
      .setPopup(new mapboxgl.Popup().setText("Você está aqui!"))
      .addTo(map);

    await carregarEventos(userLatitude, userLongitude);
  } catch (error) {
    console.error("Erro ao obter localização do usuário:", error);
  }
})();

// Filtragem

document.getElementById("apply-filter").addEventListener("click", async () => {
  const tipo = document.getElementById("filter-type").value.trim();
  const categoria = document.getElementById("filter-category").value.trim();
  const precoMax =
    parseFloat(document.getElementById("filter-price").value) || null;
  const dataMax = document.getElementById("filter-date").value || null;
  const distanciaMax =
    parseFloat(document.getElementById("filter-distance").value) || null;

  await carregarEventos(userLatitude, userLongitude, {
    tipo: tipo || null,
    categoria: categoria || null,
    precoMax,
    dataMax,
    distanciaMax,
  });

  document.getElementById("filter-popup").classList.add("hidden");
});

// Atualiza valor visual do slider de distância
const distanceSlider = document.getElementById("filter-distance");
const distanceValue = document.getElementById("distance-value");

distanceSlider.addEventListener("input", () => {
  distanceValue.textContent = `${distanceSlider.value} km`;
});

// Exibir popup
document.getElementById("filter-button").addEventListener("click", () => {
  document.getElementById("filter-popup").classList.remove("hidden");
});

// // Usando a geolocalização do usuário para marcar no mapa sua localizacao e para centralizar o mapa
// async function initializeMap() {
//   let coords;

//   try {
//     coords = await getUserLocation();
//     console.log("Localização por geolocalização do usuário: ", coords);
//   } catch (error) {
//     console.warn(
//       "Geolocalização foi recusada, tentando obtê-la pelo endereço IP…"
//     );
//     coords = await getLocationByIP();
//     if (!coords) {
//       console.error("Não foi possível determinar a geolocalização do usuário.");
//       return;
//     }
//     console.log("Geolocalização obtida pelo endereço IP: ", coords);
//   }

//   const { latitude, longitude } = coords;

//   map.setCenter([longitude, latitude]);
//   map.setZoom(12.5);
//   new mapboxgl.Marker()
//     .setLngLat([longitude, latitude])
//     .setPopup(new mapboxgl.Popup().setText("Voce esta aqui!"))
//     .addTo(map);

//   await carregarEventosProximos(latitude, longitude);
// }
// initializeMap();
