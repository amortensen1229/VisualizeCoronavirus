//Event Listeners for Cards:
$('#left-tile').click(function () {
  window.location.href = "GlobalData.html"
});

$('#center-tile').click(function () {
  window.location.href = "UnitedStatesData.html"
});

$('#right-tile').click(function () {
  window.location.href = "UnitedStatesData.html"
})





































//=============================//
// Particle JS Configuration:  //
//=============================//

particlesJS('particles-js',
{
  "particles": {
    "number": {
      "value": 4,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#61dafb"
    },
    "shape": {
      "type": "image",
      "stroke": {
        "width": 0,
        "color": "#000"
      },
      "polygon": {
        "nb_sides": 3
      },
      "image": {
        "src": "virus.png",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.6173117875485407,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 0.2436239055957366,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 4,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 10,
        "size_min": 40,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 200,
      "color": "#ffffff",
      "opacity": 1,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 8,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "grab"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 2
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}
);