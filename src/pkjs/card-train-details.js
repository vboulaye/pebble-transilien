const UI = require('pebblejs/ui');
const Feature = require('pebblejs/platform/feature');

function CardTrainDetails(station) {

  const self = this;
  console.log('init CardTrainDetails: ' + JSON.stringify(station));
  this.station = station;

  this.card = new UI.Menu({
    backgroundColor: 'black',
    textColor: 'white',
    highlightBackgroundColor: Feature.color('orange','white'),
    highlightTextColor: Feature.color('white','black'),
    status: {
      color: 'white',
      backgroundColor: 'black',
      separator: 'none',
    },
  });


  if (station.subtitle) {
    this.card.sections( [{title: station.title + "-" + station.subtitle}])
  } else {
    this.card.sections( [{title: station.title}])
  }

  this.card.on('select', function () {
    self.refresh();
  });
}


CardTrainDetails.prototype.preRefreshCardContents = function preRefreshCardContents() {
  this.card.items(0, [{
    title: 'Chargement...'
  }]);
};


CardTrainDetails.prototype.refreshCardContents = function refreshCardContents(schedulesList) {
  var items = [];

  schedulesList.forEach(function (schedule) {
    var display = schedule.display;

    var subtitle;
    if (display.etat) {
      subtitle = display.etat + ' ';
    }
    if (display.destination) {
      subtitle = (subtitle || "" ) + display.destination;
    }
    items.push({
      title: display.time + ' ' + display.mission,
      subtitle: subtitle,
    });
  });

  //  console.log(schedules);
  this.card.items(0, items);

};

CardTrainDetails.prototype.refreshErrors = function (error) {
  this.card.items(0, [{title: error}]);
};

CardTrainDetails.prototype.show = function () {
  this.card.show();
};

module.exports = CardTrainDetails;
