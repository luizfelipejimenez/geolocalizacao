//Importando arquivo json da localizações das fazendas
import jsonData from '../ArquivosJson/AREA_IMOVEL.json' assert {type: 'json'}; 

console.log(jsonData);

const poligonos = jsonData.features.map(feature => {
  const coords = feature.geometry.coordinates;
  const type = feature.geometry.type;
  const properties = feature.properties;
  let polygon;

  if (type === 'Polygon') {
    polygon = turf.polygon(coords);
  } else if (type === 'MultiPolygon') {
    polygon = turf.multiPolygon(coords);
  } else {
    throw new Error('Invalid geometry type');
  }

  return {
    type: 'Feature',
    properties,
    geometry: polygon.geometry
  };
});


//adicionando o mapa
    var map = L.map('mapid').setView([-20.664, -55.920], 7);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
    }).addTo(map);

//Funções para estilo

var myStyle = {
      "color": "#ff7800",
      "weight": 0.5,
      "opacity": 1,
      "fillOpacity": 0.4,
};

  //adicionando os poligonos das fazendas
    L.geoJSON(jsonData, {
          style: myStyle,
          onEachFeature: function(feature, layer){
            var codImovel = feature.properties.COD_IMOVEL;
            var numArea = feature.properties.NUM_AREA;
            var codEstado = feature.properties.COD_ESTADO;
            var nomMunici = feature.properties.NOM_MUNICI;
            var numModulo = feature.properties.NUM_MODULO;
            var tipoImove = feature.properties.TIPO_IMOVE;
            var situacao = feature.properties.SITUACAO;
            var condicao = feature.properties.CONDICAO_I;
            
            if (tipoImove == 'IRU') {
              tipoImove = 'Imóvel Rural'
            }

            layer.bindPopup('' + codImovel +
            '<br/>Tamanho do imovel: ' + numArea +
            '<br/>Tipo do imovel: ' + tipoImove
            )

          },
      }).addTo(map);

// Calcula as sobreposições entre os polígonos
function calcularSobreposicoes(jsonData) {
    const sobreposicoes = [];
    for (let i = 0; i < jsonData.length; i++) {
      for (let j = i + 1; j < jsonData.length; j++) {
        const sobreposicao = turf.intersect(jsonData[i], jsonData[j]);
        if (sobreposicao) {
          sobreposicoes.push(sobreposicao);
        }
      }
    }
    return sobreposicoes;
  }
  
  /* Obtém os polígonos das fazendas
  const poligonos = jsonData.features.map(feature => {
    return turf.multiPolygon(feature.geometry.coordinates);
  });
  */

  
  // Calcula as sobreposições
  const sobreposicoes = calcularSobreposicoes(poligonos);
  
  // Adiciona as sobreposições no mapa
  L.geoJSON(sobreposicoes, {
    style: { color: 'red' }
  }).addTo(map);

  



// função caso de algum erro
function error(err){
    console.log(err);
}



