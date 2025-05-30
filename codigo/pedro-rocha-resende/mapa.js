let latitude;
let longitude;

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

// Função que carrega os eventos do JSON e bota no mapa

async function carregarEventosProximos(userLat, userLon) {
  const response = await fetch("data/eventos.json");
  const eventos = await response.json();

  for (const evento of eventos) {
    let coords = evento.geolocalizacao;

    // Se não tem coordenadas, usa o endereço e a API de geocodificação, para obter as coordenadas
    if (!coords || coords.length !== 2) {
      const enderecoCompleto = `${evento.local.endereco}, ${evento.local.cidade}, ${evento.local.estado}`;
      coords = await geocodeEndereco(enderecoCompleto);
    }

    if (coords) {
      const [lon, lat] = coords;
      const distancia = haversineDistance(userLat, userLon, lat, lon);

      if (distancia <= 10) {
        new mapboxgl.Marker({ color: "#ff5e5e" })
          .setLngLat([lon, lat])
          .setPopup(new mapboxgl.Popup().setHTML(gerarPopupCardMapa(evento)))
          .addTo(map);
      }
    }
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

// Obtendo a posição atual do usuário com Geolocation API (https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) (requer permissão do usuário para acessar sua geolocalização)

function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

// Obtendo a geolocalização do usuário por meio da geolocation API e, caso ela seja recusada, determinando a geolocalização aproximada por meio do endereço IP. Com a geolacalização obtida, inicializa-se o mapa e se marca a localização do usuário.
async function initializeMap() {
  let coords;

  try {
    coords = await getUserLocation();
    console.log("Localização por geolocalização do usuário: ", coords);
  } catch (error) {
    console.warn(
      "Geolocalização foi recusada, tentando obtê-la pelo endereço IP…"
    );
    coords = await getLocationByIP();
    if (!coords) {
      console.error("Não foi possível determinar a geolocalização do usuário.");
      return;
    }
    console.log("Geolocalização obtida pelo endereço IP: ", coords);
  }

  const { latitude, longitude } = coords;

  map.setCenter([longitude, latitude]);
  map.setZoom(12.5);
  new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .setPopup(new mapboxgl.Popup().setText("Voce esta aqui!"))
    .addTo(map);

  await carregarEventosProximos(latitude, longitude);
}
initializeMap();

async function getLocationByIP() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    if (data && data.latitude && data.longitude) {
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
    } else {
      throw new Error("IP location not available");
    }
  } catch (error) {
    console.error("Erro ao obter localização por IP:", err);
    return null;
  }
}
