
const getNextStops = require('./card-ratp-parser.js');

function RatpSchedule(station) {
  console.log('init RatpSchedule: ' + JSON.stringify(station));
  this.station = station;
}

RatpSchedule.prototype.refresh = function(onSuccess, onError) {
  getNextStops(this.station, onSuccess, onError);
};


module.exports = RatpSchedule;
