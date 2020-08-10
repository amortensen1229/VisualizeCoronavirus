/* Helper Utilities: */
//=====================================================//
/*Constructor Function Defintion*/
function country(name, confirmed, deaths, recovered, slug, newConfirmed, newDeaths, newRecovered) {
  this.name = name;
  this.confirmed = confirmed;
  this.deaths = deaths;
  this.recovered = recovered;
  this.slug = slug;
  this.newConfirmed = newConfirmed;
  this.newDeaths = newDeaths;
  this.newRecovered = newRecovered;
  this.case_date_map = new Map();
}
//Function for adding commas:
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//=====================================================//


/*
////////////////////////////////
//Filling Global Information: //
////////////////////////////////
* called on application load
*/
function fill_global_information(data) {
  global_data = new country("", data.Global.TotalConfirmed, data.Global.TotalDeaths, data.Global.TotalRecovered, "", 0, 0, 0);
  pi_chart_protocol(global_data);
  
  var new_conf = numberWithCommas(data.Global.NewConfirmed);
  var new_deaths = numberWithCommas(data.Global.NewDeaths);
  var new_rec = numberWithCommas(data.Global.NewRecovered);
  var total_cases = numberWithCommas(data.Global.TotalConfirmed);
  var total_rec = numberWithCommas(data.Global.TotalRecovered);
  var total_death = numberWithCommas(data.Global.TotalDeaths);
  var total_active = numberWithCommas(data.Global.TotalConfirmed - data.Global.TotalRecovered - data.Global.TotalDeaths);
  $("#new-cases").html(new_conf);
  $("#new-death").html(new_deaths);
  $("#new-recovered").html(new_rec);
  $("#total-cases").html(total_cases);
  $("#total-recovered").html(total_rec);
  $("#total-deaths").html( total_death);
  $("#active-cases").html(total_active);
  $("#total-deaths-frac").html(((data.Global.TotalDeaths/data.Global.TotalConfirmed) * 100).toFixed(2) + "%");
  $("#total-recovered-frac").html(((data.Global.TotalRecovered/data.Global.TotalConfirmed) * 100).toFixed(2) + "%");
  $("#active-cases-frac").html((((data.Global.TotalConfirmed - data.Global.TotalRecovered - data.Global.TotalDeaths)/data.Global.TotalConfirmed) * 100).toFixed(2) + "%");
}

function line_chart_protocol(cases, dates) {
  //Delete Current Chart Information:
  line_graph.data.labels.pop();
  line_graph.data.datasets.forEach((dataset) => {
      dataset.data.length = 0;
  });


  
  //Insert New Chart Information:
  line_graph.data.labels = dates;
  $.each(cases, function(i,val) {
    line_graph.data.datasets[0].data.push(val);
  });
    
  line_graph.reset();
  line_graph.update( {
    duration: 800,
    easing: 'easeOutQuart'
  }
  );
}


function pi_chart_protocol(country) {
  var pop_data = [(country.confirmed - country.recovered - country.deaths), country.recovered, country.deaths];

  //Delete Current Chart Data:
  pi_graph.data.datasets.forEach((dataset) => {
    dataset.data.length = 0;
  });
      
  //Insert New Chart Information:
  for (let item of pop_data) {
    pi_graph.data.datasets[0].data.push(item);
  }

  pi_graph.reset();
  pi_graph.update( {
    duration: 1000,
    easing: 'easeOutQuart'
  }

  );

}


function bar_chart_protocol() {
  //Delete Current Chart Information:
  bar_graph.data.labels.pop();
  bar_graph.data.datasets.forEach((dataset) => {
    dataset.data.length = 0;
  });

    //Insert New Chart Information:
    let names = [];
    for (let i = 0; i < epicenter_countries.length; i++) {
      names.push(epicenter_countries[i].name);
    }
    bar_graph.data.labels = names;
    $.each(epicenter_countries, function(i,val) {
      bar_graph.data.datasets[0].data.push(val.confirmed);
    });
      
    bar_graph.reset();
    bar_graph.update( {
      duration: 800,
      easing: 'easeOutQuart'
    }
    );
}


function get_country_data(name) {
  var country_slug = country_slug_map.get(name.toString());
  api_dayone_link = 'https://api.covid19api.com/total/dayone/country/' + country_slug;
  $.ajax({
    url: api_dayone_link,
    type: 'GET',
    dataType: "json",
    success: function(data) {
      console.log(data);
      cases = [];
      dates = [];
      $.each(data, function(i, val) {
        if (i % 7 == 0) {
          if (val.Date.includes('T')) {
            cases.push(val.Active);
            dates.push(val.Date.split("T")[0]);

            //case_date.set(val.Active, val.Date.split("T")[0]);
          }
        }
      });
 

      $("#dropdownMenu").html(name + " Data");
      $("#stats-title").html("Statistics: " + name)
      for (let country of countries_set) {
        if (country.name == name) {
          $("#new-cases").html("Today's Cases: <br/>" + numberWithCommas(country.newConfirmed));
          $("#new-death").html("Today's Deaths: <br/>" + numberWithCommas(country.newDeaths));
          $("#new-recovered").html("Today's Recovered: <br/>" + numberWithCommas(country.newRecovered));
          $("#total-cases").html("Total Cases: <br/>" + numberWithCommas(country.confirmed));
          $("#total-recovered").html("Total Recovered: <br/>" + numberWithCommas(country.recovered));
          $("#total-deaths").html("Total Deaths: <br/>" + numberWithCommas(country.deaths));
          $("#active-cases").html("Total Active Cases: <br/>" + numberWithCommas(country.confirmed - country.recovered - country.deaths));
          // Once HTML elements have been changed and country is identified
          // Call Charting Protocols:
          pi_chart_protocol(country);
          
          line_chart_protocol(cases, dates);
          break;
        } 
      }
    }
  });

} 


/*
/////////////////////////////////////////////////
//Filling Country Information & Countries Set: //
/////////////////////////////////////////////////
* called on application load
*/
function fill_country_options(data) {
  var countries = data.Countries;
  for (let i = 0; i < 4; i++) {
    epicenter_countries.push(new country("", 0, 0, 0, "", 0, 0, 0));
  }
  $.each(countries, function (i, val) {
    //$(".dropdown-menu").append(
     // '<button class="dropdown-item" type="button" onclick="get_country_data(\'' + countries[i].Country + '\')">'+ countries[i].Country + '</button>'
    //)
    country_slug_map.set(val.Country, val.Slug);
    countries_set.add(new country(
      val.Country, val.TotalConfirmed, 
      val.TotalDeaths, val.TotalRecovered, 
      val.Slug, val.NewConfirmed, val.NewDeaths,
      val.NewRecovered));
      console.log(epicenter_countries.length);
    for (let i = 0; i < 4; i++) {
      if (val.TotalConfirmed >(epicenter_countries[i].confirmed)) {
        epicenter_countries[i] = new country(
          val.Country, val.TotalConfirmed, 
          val.TotalDeaths, val.TotalRecovered, 
          val.Slug, val.NewConfirmed, val.NewDeaths,
          val.NewRecovered);
          break;
      }
    }
    //Fill Epicenter Data:
    /*
    $("#epicenter-countries").html(
      "1. " + epicenter_countries[0].name + "<br/>" + 
      "2. " + epicenter_countries[1].name + "<br/>" +
      "3. " + epicenter_countries[2].name + "<br/>" +
      "4. " + epicenter_countries[3].name + "<br/>" +
      "5. " + epicenter_countries[4].name + "<br/>" 
    );
    */

  });
  bar_chart_protocol();

}



//Run on Document Load:
$("document").ready(function() {
  $.ajax({
    url: "https://api.covid19api.com/summary",
    type: 'GET',
    dataType: "json",
    success: function(data, status) {
      
      fill_global_information(data);
      fill_country_options(data);
      media_changes_small(media_break_small);
    },
  });
});



//GLOBAL SCOPE VARIABLES:
//==============================//
let country_slug_map = new Map();
let countries_set = new Set();
let epicenter_countries = [];
let pi_data = [];
//==============================//





//Creating Pi-Chart Object:
//===========================================================================//
var ctx_pi = document.getElementById('pi-chart').getContext('2d');
var pi_graph = new Chart(ctx_pi, {
  type: 'doughnut',
  data: {
    labels: ['Infected', 'Recovered', 'Deaths'],
    datasets: [{
      label: '# of cases',
      fill: false,
      data:  [ pi_data[0], pi_data[1], pi_data[2]],
      backgroundColor: ['#61DAFB', '#498CA1', '#1F2833' ],
      borderColor: '#498CA1',
      hoverBackgroundColor: ['#61DAFB', '#498CA1', '#1F2833' ]
    }]
  }, 
  options: {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      labels: {
        fontColor: "#fffff"
      }
    },
    title: {
      display: true,
      text: 'Affected Population',
      fontSize: 18,
      fontColor: "#ffffff"
    }
  }
});
//===========================================================================//


//Creating Bar-Chart Object:
//===========================================================================//
var ctx_bar = document.getElementById('epicenter-countries').getContext('2d');
var bar_graph = new Chart(ctx_bar, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      minBarThickness: 20,
      maxBarThickness: 65,
      label: "Number of Active Cases",
      data: [],
      backgroundColor: ['#61DAFB', '61DAFB', '61DAFB', '#61DAFB'],
      hoverBackgroundColor: ['#61DAFB', '#61DAFB', '#61DAFB', '#61DAFB']
    }]
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      labels: {
        fontColor: "#fffff"
      }
    },


    title: {
      display: true,
      text: 'Worst Countries By Epicenter',
      fontSize: 18,
      fontColor: "#ffffff"
    }
  }
});
Chart.defaults.global.defaultFontColor = 'white';
//===========================================================================//


//Media Queries:
//===========================================================================//

var media_break_small = window.matchMedia("(max-width: 992px)");
var media_break_large = window.matchMedia("(min-width: 993px)");
media_break_small.addListener(media_changes_small);
media_break_large.addListener(media_changes_large);

function media_changes_small(current_width) {
  console.log("checking");
  if (current_width.matches) {
    bar_graph.options.scales.xAxes = [{
      display: false
    }];     
  }
}

function media_changes_large(current_width) {
  if (current_width.matches) {
    bar_graph.options.scales.xAxes = [{
      display: true
    }];     
  }
}







/*
//Creating Line-Chart Object:
//===========================================================================//
var ctx_line = document.getElementById('line-chart').getContext('2d');
var line_graph = new Chart(ctx_line, {
  type: 'line',
  data: {
    labels: date,
    datasets: [{
      label: '# of cases',
      fill: false,
      data:  [],
      backgroundColor: '#66FCF1 ',
      borderColor: '#45A29E' 
    }]
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,

    title: {
      display: true,
      text: 'Population Data',
      fontSize: 20
    },
    tooltips: {
      mode: 'nearest',
      intersect: false,
      backgroundColor: '#1F2833'
    },
    hover: {
      intersect: false
    },
    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          color: "#1F2833"
        },
        scaleLabel: {
          display: true,
          labelString: 'Weekly'
        }
      }],
      yAxes: [{
        display: true,
        gridLines: {
          color: "#1F2833"
        },
        scaleLabel: {
          display: true,
          labelString: 'Number of Cases'
        }
      }]
    }
  }
});
Chart.defaults.global.defaultFontColor = '#C5C6C7';
*/