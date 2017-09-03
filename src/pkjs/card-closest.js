const UI = require('pebblejs/ui');
const util2 = require('pebblejs/lib/util2');
const Feature = require('pebblejs/platform/feature');

const getClosestStations = require('./gares/closest-station.js');
const CardTrain = require('./card-train.js');
const SncfSchedule = require('./sncf-schedule.js');
const RatpSchedule = require('./ratp-schedule.js');

function mod(a, n) {
  return ((a % n) + n) % n;
}


function CardClosestStations() {

  const self = this;
  console.log('init CardClosestStations: ');

  self.card = new UI.Menu({
    backgroundColor: 'black',
    textColor: 'white',
    highlightBackgroundColor: Feature.color('orange', 'white'),
    highlightTextColor: Feature.color('white', 'black'),
//    scrollable: false,
//    status: false
    status: {
      color: 'white',
      backgroundColor: 'black',
      separator: 'none',
    },
  });

  // handle menu item selection
  self.card.on('select', function (event) {
    var cardTrain;
    const station = event.item.station;
    if (station.gare_non_sncf === 1) {
      console.log('RatpSchedule:' + JSON.stringify(station));
      cardTrain = new CardTrain(new RatpSchedule({
        title: station.libelle_sms_gare || station.nom_gare,
        source: station.libelle_point_d_arret.toLowerCase().replace(/ +/g, '+'),
        network: station.network,
        line: station.line,
        direction: station.direction,
      }));
    } else {
      cardTrain = new CardTrain(new SncfSchedule({
        title: station.nom_gare,
        source: station.code_uic,
      }));

    }
    cardTrain.refresh();

    // cardTrain.sectionIndex = event.sectionIndex;
    // cardTrain.itemIndex = event.itemIndex;
    // console.log('cardTrain.itemIndex'+cardTrain.itemIndex    );
    // cardTrain.card.on('click','up', function(){
    //   var menuLength = self.card.sections(cardTrain.sectionIndex).items().length;
    //   cardTrain.card.hide();
    //   self.card.selection(cardTrain.sectionIndex, mod(cardTrain.itemIndex-1,menuLength));
    // });
    // cardTrain.card.on('click','down', function(){
    //   var menuLength = self.card.sections(event.sectionIndex).items().length;
    //   console.log(menuLength+'down: '+ event.sectionIndex+";"+event.sectionIndex)
    //   cardTrain.card.hide();
    //   self.card.selection(cardTrain.sectionIndex, mod(cardTrain.itemIndex+1,menuLength));
    // });
    cardTrain.show();
  });

  self.card.on('longSelect', function () {
    self.refresh();
  });

}


CardClosestStations.prototype.preRefreshContents = function () {
  this.card.sections(0, {
    title: 'Chargement...'
  });
};

CardClosestStations.prototype.refreshContents = function (stations) {
  const self = this;
  var stationItems = [];

  stations.forEach(function (station) {

    var item = {
      title: station.libelle_sms_gare || station.nom_gare,
      subtitle: station.dist + 'm',
      station: station,
    };
    if (station.gare_non_sncf === 1) {
      //hack as we do not have a simple way to find back the proper line
      station.network = 'RER';
      station.line = 'B';
      //duplicate the ratp stations to get both ways
      const aller = util2.copy(item);
      aller.station = util2.copy(aller.station);
      aller.subtitle += ' (aller)';
      aller.station.direction = 'A';
      aller.station.subtitle = 'aller';
      stationItems.push(aller);
      const retour = util2.copy(item);
      retour.station = util2.copy(item.station);
      retour.subtitle += ' (retour)';
      retour.station.direction = 'R';
      retour.station.subtitle = 'aller';
      stationItems.push(retour);

    } else {
      stationItems.push(item);
    }
  });

  // console.log('stationItems: ' + JSON.stringify(stationItems));

  self.card.section(0, {title: '', items: stationItems});

};

CardClosestStations.prototype.refreshError = function (error) {
  this.card.section(0, [{title: error}]);
};

CardClosestStations.prototype.refresh = function (onSuccess, onError) {

  const self = this;
  self.preRefreshContents();

  getClosestStations(function (stations) {
    self.refreshContents(stations)
    if (onSuccess) {
      onSuccess(stations);
    }
  }, function (err) {
    self.refreshError(err);
    if (onError) {
      onError(err);
    }
  });

};

CardClosestStations.prototype.show = function () {
  this.card.show();
};

module.exports = CardClosestStations;
