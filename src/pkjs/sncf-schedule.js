
const getNextSncfStops = require('./card-sncf-parser.js');

function SncfSchedule(station) {
  console.log('init ScheduleSncf: ' + JSON.stringify(station));
  this.station = station;
}

SncfSchedule.prototype.refresh = function(onSuccess, onError) {
  getNextSncfStops(this.station, onSuccess, onError);
};


module.exports = SncfSchedule;
