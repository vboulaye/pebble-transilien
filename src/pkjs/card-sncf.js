
const UI = require('pebblejs/ui');

var DOMParser = require('xmldom').DOMParser;

var getNextSncfStops = require('./card-sncf-parser.js');


function refreshNextStopsCard() {

  var card = this.card;
  var station = this.station;

  // card.title(station.network + ' ' + station.line);
  // card.subtitle(station.source.replace(/\+/g, ' '));

  card.icon(station.icon);
  card.title(station.title +"-"+station.subtitle);
  card.body('chargement...');

  //console.log("refreshNextStopsCard " + station.title);

  getNextSncfStops(station, function (schedulesList) {
    var schedules = "";

    schedulesList.forEach(function (schedule) {
      if (schedule.message) {
        schedules += schedule.message + "\n";
      }
    });

  //  console.log(schedules);
    card.body(schedules);

  }, function (err) {
    card.body(err);
  });

}


function CardSncf(station) {

  console.log('init CardSncf: ' + JSON.stringify(station));

  this.card = new UI.Card({
    subtitleColor: 'indigo', // Named colors
    bodyColor: '#9a0036', // Hex colors
    style: 'mono'
  });

  this.refresh = refreshNextStopsCard;
  this.station = station;


}

CardSncf.prototype.refresh = refreshNextStopsCard;

CardSncf.prototype.show = function () {
  this.card.show();
};

module.exports = CardSncf;
