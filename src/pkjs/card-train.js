const UI = require('pebblejs/ui');
const Vector2 = require('pebblejs/lib/vector2');
const Feature = require('pebblejs/platform/feature');
const moment = require('pebblejs/vendor/moment');

const CardTrainDetails = require('./card-train-details.js');
const NextTrain = require('./time-next-train.js');


UI.Window.prototype.center = function (element, moveVector) {
  var wind = this;
  var windSize = wind.size();
// Center the radial in the window
  var elementPos = element.position()
    .addSelf(windSize)
    .subSelf(element.size())
    .multiplyScalar(0.5);
  if (moveVector) {
    elementPos = elementPos.subSelf(moveVector);
  }
  element.position(elementPos);
  wind.add(element);
  return element;
};


function CardTrain(schedule) {
  const self = this;
  console.log('init CardTrain: ' + JSON.stringify(schedule.station));

  if (!schedule) {
    throw new Error('schedule should be defined');
  }
  if (!schedule.station) {
    throw new Error('schedule.station should be defined');
  }
  if (!schedule.refresh) {
    throw new Error('schedule.refresh() should be defined');
  }

  this.schedule = schedule;
  const station = schedule.station;
//
//   this.card = new UI.Card({
//     status: false,
// //    icon : station.icon,
//     title: station.title + "\n" + station.subtitle,
//     subtitleColor: 'indigo', // Named colors
//     bodyColor: '#9a0036', // Hex colors
//     //   style: 'mono'
//   });
  const backgroundColor = 'black';
  const color = 'white';
  const colorMinutes = Feature.color('orange', 'white');

  this.card = new UI.Window({
    backgroundColor: backgroundColor,
    status: {
      color: color,
      backgroundColor: backgroundColor,
      separator: 'none',
    },
  });

  const size = this.card.size();

  const fromField = new UI.Text({
    size: new Vector2(size.x, 28),
    position: new Vector2(0, -4),
    font: 'gothic-28-bold',
    text: station.title,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    // backgroundColor: 'black',
    //color: 'windsorTan'
    color: color,
  });



  var toVerticalPosition = Feature.round(48, 32);
  const toField = new UI.Text({
    size: new Vector2(size.x, new Vector2(0, size.y - toVerticalPosition)),
    position: toVerticalPosition,
    font: 'gothic-28-bold',
    text: station.subtitle,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    // backgroundColor: 'black',
    //color: 'windsorTan'
    color: color,
  });

  this.nextStopField = new UI.Text({
    size: new Vector2(size.x, 40),
    position: new Vector2(0, 25),
    font: 'leco-36-bold-numbers',
    //   color:'orange',
    textAlign: 'center',
    //color: 'windsorTan'
    color: colorMinutes,
  });
  this.nextStopUnit = new UI.Text({
    size: new Vector2(size.x, 20),
    position: new Vector2(0, 60),
    font: 'gothic-18-bold',
    // color:'orange',
    textAlign: 'center',
    //color: 'windsorTan'
    color: colorMinutes,
  });
  this.nextStopDetailsField = new UI.Text({
    size: new Vector2(size.x, 60),
    position: new Vector2(0, 80),
    font: 'gothic-18-bold',
    // color:'orange',
    textAlign: 'center',
    //color: 'windsorTan'
    color: color,
  });

  this.card.add(fromField);
  this.card.add(this.nextStopField);
  this.card.add(this.nextStopUnit);
  this.card.add(this.nextStopDetailsField);
  this.card.add(toField);
  this.preRefreshContents();

  this.card.on('click', 'select', function (e) {
    self.displayDetails();
  });

}

CardTrain.prototype.preRefreshContents = function preRefreshContents() {
  const self = this;
  self.nextStopField.text('-');
  this.nextStopUnit.text('')
  self.nextStopDetailsField.text('chargement...');
};


CardTrain.prototype.refreshContents = function refreshContents(schedulesList) {
  const self = this;

  const nextTrain = schedulesList[0] ? schedulesList[0].display:{
    time: '??:??',
    etat: 'pas de réponse'
  };

  var nextTrainMinutes = NextTrain(nextTrain.time);
  self.nextStopField.text(nextTrainMinutes);

  const unit = nextTrainMinutes <= 1 ? 'minute' : 'minutes';
  this.nextStopUnit.text(unit);

  var details = nextTrain.mission || '';
  if (nextTrain.etat) {
    details += ' ' + nextTrain.etat;
  }
  details += '\n';
  if (nextTrain.destinationShort) {
    details += nextTrain.destinationShort;
  }

  self.nextStopDetailsField.text(details);

};

CardTrain.prototype.refreshError = function refreshError(err) {
  const self = this;
  self.nextStopDetailsField.text(JSON.stringify(err));
};

CardTrain.prototype.refresh = function refreshNextStopsCard(onSuccess, onError) {

  const self = this;

  self.preRefreshContents();

  self.schedule.refresh(function (schedulesList) {
    // keep track of the schedules for the details screen
    self.schedulesList = schedulesList;
    self.refreshContents(schedulesList)
    if (onSuccess) {
      onSuccess(schedulesList);
    }
  }, function (err) {
    self.refreshError(err);
    if (onError) {
      onError(err);
    }
  });

};

CardTrain.prototype.show = function () {
  this.card.show();
};

CardTrain.prototype.displayDetails = function () {
  const self = this;
  const cardDetails = new CardTrainDetails(self.schedule.station);
  if (self.schedulesList) {
    cardDetails.refreshCardContents(self.schedulesList);
  }
  // the details refresh should hook back on the main card refresh
  cardDetails.refresh = function (onSuccess, onError) {
    cardDetails.preRefreshCardContents();
    self.refresh(function (schedulesList) {
      cardDetails.refreshCardContents(self.schedulesList);
      if (onSuccess) {
        onSuccess(schedulesList);
      }
    }, onError);
  };
  cardDetails.show();
}

module.exports = CardTrain;
