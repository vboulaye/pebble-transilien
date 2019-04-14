// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}
var moment;
try {
  moment = require('pebblejs/vendor/moment');
} catch (e) {
  moment = _moment;
}

const NextTrain = require('./time-next-train.js');

function getNextRatpStops(station, onSuccess, onError) {

  const NETWORK_MAPPINGS = {
    RER: 'rers',
    M: 'metros'
  };


  const network = station.network;
  const line = station.line;

  var url = "https://api-ratp.pierre-grimaud.fr/v3/schedules/"
    + NETWORK_MAPPINGS[network] + "/" + line + "/"
    + station.source;
  if (station.direction) {
    url += "/" + station.direction;
  }
  console.log("api-ratp url:" + url);

  ajax({
      url: url,
      type: 'json'
    },
    function (data) {
      // console.log(JSON.stringify(data));//Train à quai V.1
      if (data.result
        && data.result.schedules) {


        const schedules = data.result.schedules
        //  filter out the non stopping trains
          .filter(function (schedule) {
            return !(schedule.message.match(/^Sans /)
              || schedule.message.match(/^Train Sans /));
          })
          .map(function (schedule) {

              schedule.display = {};

              if ('Schedules unavailable' === schedule.code) {
              }


              schedule.message = schedule.message.replace(/^Départ /, '')
              schedule.message = schedule.message.replace(/^Train /, '')

              // matches a l approche [+ voie]
              if (schedule.message.indexOf(' l\'approche') > -1) {
                schedule.display.etat = schedule.message;
                schedule.display.time = moment().format('HH:mm');
                // matches a quai [+ voie]
              } else if (schedule.message.indexOf(' quai') > -1) {
                schedule.display.etat = schedule.message;
                schedule.display.time = moment().format('HH:mm');
                // matches time + voie
              } else if (schedule.message.indexOf(' ') > 0) {
                schedule.display.etat = schedule.message.substr(schedule.message.indexOf(' ') + 1);
                schedule.display.time = schedule.message.substr(0, schedule.message.indexOf(' '));
              } else {
                schedule.display.time = schedule.message;
              }

              schedule.display.nextTrainMinutes = NextTrain(schedule.display.time);
              schedule.display.mission = schedule.code;

              if (schedule.code) {
                schedule.message += " " + schedule.code;
              }
              //destination is useless here, does not show the actual end of the line
              // if (schedule.destination) {
              //   schedule.message += " " + schedule.destination;
              // }
              return schedule;
            }
          );

        onSuccess(schedules);
      }
    },
    function (err) {
      if (!err) {
        err = 'http call error';
      }
      console.log("error in api-ratp call:" + JSON.stringify(err));
      onError(err);
    }
  );
}

module.exports = getNextRatpStops;

