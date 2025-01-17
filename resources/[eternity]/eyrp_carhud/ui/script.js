$(document).ready(function(){

  window.addEventListener("message", function(event){
    // Show HUD when player enter a vehicle
    if(event.data.showhud == true){
      $('.huds').fadeIn();
      setProgressSpeed(event.data.speed,'.progress-speed');
    }
    if(event.data.showhud == false){
      $('.huds').fadeOut();
    }

    // Fuel
    if(event.data.showfuel == true){
      setProgressFuel(event.data.fuel,'.progress-fuel');
      if(event.data.fuel <= 20){
        $('.progress-fuel').addClass('orangeStroke');
      }
      if(event.data.fuel <= 10){
        $('.progress-fuel').removeClass('orangeStroke');
        $('.progress-fuel').addClass('redStroke');
      }
    }

    // Lights states
    if(event.data.feuPosition == true){
      $('.feu-position').addClass('active');
    }
    if(event.data.feuPosition == false){
      $('.feu-position').removeClass('active');
    }
    if(event.data.feuRoute == true){
      $('.feu-route').addClass('active');
    }
    if(event.data.feuRoute == false){
      $('.feu-route').removeClass('active');
    }
    if(event.data.clignotantGauche == true){
      $('.clignotant-gauche').addClass('active');
    }
    if(event.data.clignotantGauche == false){
      $('.clignotant-gauche').removeClass('active');
    }
    if(event.data.clignotantDroite == true){
      $('.clignotant-droite').addClass('active');
    }
    if(event.data.clignotantDroite == false){
      $('.clignotant-droite').removeClass('active');
    }

    if(event.data.seatbelt == true) {
      $('.seatbelt').attr('src', 'https://i.imgur.com/PcxVVIH.png')
      $('.seatbelt').removeClass('off')
      $('.seatbelt').addClass('on')
    } else if (event.data.seatbelt == false) {
      $('.seatbelt').attr('src', 'https://i.imgur.com/IT2014d.png')
      $('.seatbelt').removeClass('on')
      $('.seatbelt').addClass('off')
    }

    if (event.data.engine == 1) {
      if ($('.engine').attr('src') == 'https://i.imgur.com/jpxJ0uT.png') { return }

      $('.engine').attr('src', 'https://i.imgur.com/jpxJ0uT.png')
    } else if (event.data.engine == 2) {
      if ($('.engine').attr('src') == 'https://i.imgur.com/94VOlQJ.png') { return }

      $('.engine').attr('src', 'https://i.imgur.com/94VOlQJ.png')

    } else if (event.data.engine == 3) {
      if ($('.engine').attr('src') == 'https://i.imgur.com/f582Chr.png') { return }

      $('.engine').attr('src', 'https://i.imgur.com/f582Chr.png')

    }


  });

  // Functions
  // Fuel
  function setProgressFuel(percent, element){
    var circle = document.querySelector(element);
    var radius = circle.r.baseVal.value;
    var circumference = radius * 2 * Math.PI;
    var html = $(element).parent().parent().find('span');

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    const offset = circumference - ((-percent*73)/100) / 100 * circumference;
    circle.style.strokeDashoffset = -offset;

    html.text(Math.round(percent));
  }

  // Speed
  function setProgressSpeed(value, element){
    var circle = document.querySelector(element);
    var radius = circle.r.baseVal.value;
    var circumference = radius * 2 * Math.PI;
    var html = $(element).parent().parent().find('span');
    var percent = value*100/220;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    const offset = circumference - ((-percent*73)/100) / 100 * circumference;
    circle.style.strokeDashoffset = -offset;

    html.text(value);
  }

  // setProgress(input.value,element);
  // setProgressFuel(85,'.progress-fuel');
  // setProgressSpeed(124,'.progress-speed');

});
