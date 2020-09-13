/* 
NOTES:
For Each country....
  -confirmed cases
  -lat long
  -name
*/


function mapping_country(name, lat, long, confirmed) {
  this.name = name;
  this.lat = lat;
  this.long = long;
  this.confirmed = confirmed;
}

//Function for adding commas:
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* Construct Map: */
var mymap = L.map('leaflet-map').setView([25, -25], 2);
L.tileLayer.provider('CartoDB.DarkMatterNoLabels').addTo(mymap);




function fill_country_options(data) {
  for (let val of data.Countries) {
      if(country_latlong[val.CountryCode.toLowerCase()]) {
        let a_mapping_country = ( new mapping_country (val.Country, 
          country_latlong[val.CountryCode.toLowerCase()][0], 
          country_latlong[val.CountryCode.toLowerCase()][1],
          val.TotalConfirmed));
          addMarker(a_mapping_country);
      } 
  }
}


$("document").ready(function() {
  $.ajax({
    url: "https://api.covid19api.com/summary",
    type: 'GET',
    dataType: "json",
    timeout: 5000,
    success: function(data, status) {
      fill_country_options(data);
    },
  }).fail(function (jqXHR, textStatus, errorThrown) {
     $('#myModal').modal('show');
  });
});


function addMarker(a_mapping_country) {
  var epicenter = L.circle([a_mapping_country.lat, a_mapping_country.long], {
    color: "#D2D3D4",
    fillColor: '#61DAFB',
    fillOpacity: 0.8,
    radius: Math.sqrt(a_mapping_country.confirmed * 170000)
  }).addTo(mymap);

  epicenter.bindTooltip("Country: <b>" + a_mapping_country.name + "</b>" +
    "<br/>Confirmed Cases: <b>" + numberWithCommas(a_mapping_country.confirmed) + "</b>");
}


