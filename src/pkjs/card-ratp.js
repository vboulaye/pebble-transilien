const UI = require('pebblejs/ui');
//const Vector2 = require('pebblejs/vector2');
const getNextRatpStops = require('./card-ratp-parser.js');

function refreshNextStopsCard() {

  var card = this.card;
  var station = this.station;

  // card.title(station.network + ' ' + station.line);
  // card.subtitle(station.source.replace(/\+/g, ' '));

  card.icon(station.icon);
  card.title(station.title +"-"+station.subtitle);
//  card.subtitle(station.subtitle);
  card.body('chargement...');

  getNextRatpStops(station, function (schedulesList) {
    var schedules = "";

    schedulesList.forEach(function (schedule) {
      if (schedule.message) {
        schedules += schedule.message + "\n";
      }
    });

    card.body(schedules);

  }, function (err) {
    card.body(err);
  });

}


function CardRatp(station) {

  console.log('init CardRatp: ' + JSON.stringify(station));

  this.card = new UI.Card({
    subtitleColor: 'indigo', // Named colors
    bodyColor: '#9a0036', // Hex colors
    style: 'mono'
  });

  this.refresh = refreshNextStopsCard;
  this.station = station;


}

CardRatp.prototype.refresh = refreshNextStopsCard;

CardRatp.prototype.show = function () {
  this.card.show();
}


module.exports = CardRatp;

