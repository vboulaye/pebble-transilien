
const UI = require('pebblejs/ui');

var getNextSncfStops = require('./card-sncf-parser.js');


function refreshNextStopsCard() {

  var card = this.card;
  var station = this.station;

  card.icon(station.icon);
  card.title(station.title +"\n"+station.subtitle);
  card.body('chargement...');

  //console.log("refreshNextStopsCard " + station.title);

  getNextSncfStops(station, function (schedulesList) {
    var schedules = "";

    schedulesList.slice(0,4).forEach(function (schedule) {
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
 //   style: 'mono'
  });

  this.refresh = refreshNextStopsCard;
  this.station = station;

}

CardSncf.prototype.refresh = refreshNextStopsCard;

CardSncf.prototype.show = function () {
  this.card.show();
};

module.exports = CardSncf;
