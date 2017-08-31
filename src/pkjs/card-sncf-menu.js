
const UI = require('pebblejs/ui');

var getNextSncfStops = require('./card-sncf-parser.js');


function refreshNextStopsCard() {

  var card = this.card;
  var station = this.station;

  // card.icon(station.icon);
  // card.title(station.title +"-"+station.subtitle);
  card.items(0,[{
    title:'chargement...'
  }]);

  //card.show();
  //console.log("refreshNextStopsCard " + station.title);

  getNextSncfStops(station, function (schedulesList) {
    var items= [];

    schedulesList.forEach(function (schedule) {
      if (schedule.message) {
        items.push({title:schedule.message});
      }
    });

  //  console.log(schedules);
    card.items(0,items);

  }, function (err) {
    console.log(err);
    card.items(0,[{
      title:JSON.stringify(err)
    }]);
  });

}


function CardSncf(station) {

  console.log('init CardSncf: ' + JSON.stringify(station));

  this.card = new UI.Menu({
    // backgroundColor: 'black',
    // textColor: 'blue',
    // highlightBackgroundColor: 'blue',
    // highlightTextColor: 'black',
    sections: [{
      title: station.title +"-"+station.subtitle,
      icon: station.icon,
      // items: [{
      //   title: 'First Item',
      //   subtitle: 'Some subtitle',
      //   icon: 'images/item_icon.png'
      // }, {
      //   title: 'Second item'
      // }]
    }]
  });


  this.refresh = refreshNextStopsCard;
  this.station = station;

}

CardSncf.prototype.refresh = refreshNextStopsCard;

CardSncf.prototype.show = function () {
  this.card.show();
};

module.exports = CardSncf;
