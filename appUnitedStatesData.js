/*GLOBAL SCOPE VARIABLES*/
/*========================================*/
var geojson;
var states = [
  ['Arizona', 'AZ'],
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
];
/*========================================*/


//Function for adding commas:
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/*Utility functions for adding functionality to cloropleth map*/
//************************************************************//
function get_color (metric) {
  return metric > 200000 ? '#022E3C':
  metric > 100000 ? '#045E77': 
  metric > 50000  ? '#08ABD9': 
                    '#B0ECFD';
}

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 2,
      color: '#52545B',
      fillOpacity: 0.7
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}


function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
  });

  if (feature.properties.covidCases) {
  }

}


function fill_color (feature) {
  return {
  fillColor: get_color(feature.properties.covidCases),
  weight: 0.7,
  opacity: 1,
  color: '#D2D3D4',
  fillOpacity: 0.65
  };
}



//************************************************************//


/* Construct Map Object*/
var mymap = L.map('leaflet-map').setView([37.8, -96], 3);
L.tileLayer.provider('CartoDB.DarkMatterNoLabels').addTo(mymap);
var info = L.control();
info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 50000, 100000, 200000],
    labels = [];
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + get_color(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};
legend.addTo(mymap);


// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Total Cases By State</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + numberWithCommas(props.covidCases) + " Cases"
        : 'Hover over a state');
};
info.addTo(mymap);





$("document").ready(function() {
  $.ajax({
    url: "https://api.covidtracking.com/v1/states/current.json",
    type: 'GET',
    dataType: "json",
    timeout: 5000,
    success: function(data, status) {
      //console.log(data);
      fill_statesData_object(data);
      console.log(statesData);
      geojson = L.geoJson(statesData, {
        style: fill_color,
        onEachFeature: onEachFeature
      }).bindTooltip(function (layer){
        return (layer.feature.properties.name + "<br/>Total Cases: <b>" + numberWithCommas(layer.feature.properties.covidCases));
      }, 
      {
        className: "tooltips"
      }).addTo(mymap);
    },
  }).fail(function (jqXHR, textStatus, errorThrown) {
     $('#myModal').modal('show');
  });
});

function fill_statesData_object (data) {
  for (let state of data) {
    for (let i = 0; i < states.length; ++i) {
      if (state.state == states[i][1]) {
        for (let j = 0; j < statesData.features.length; ++j) {
          if (states[i][0] == statesData.features[j].properties.name) {
            console.log(statesData.features[j].properties.name)
            statesData.features[j].properties['covidCases'] = state.positive;
          }
        }
      }
    }
  }
}
