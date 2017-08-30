// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}

function getNextRatpStops(station, onSuccess, onError) {

  const NETWORK_MAPPINGS = {
    RER: 'rers',
    M: 'metros'
  };

  const url = "https://api-ratp.pierre-grimaud.fr/v3/schedules/"
    + NETWORK_MAPPINGS[station.network] + "/" + station.line + "/"
    + station.source + "/" + station.direction;
  console.log("api-ratp url:" + url);

  ajax({
      url: url,
      type: 'json'
    },
    function (data) {
      //console.log(data);//Train à quai V.1
      if (data.result
        && data.result.schedules) {
        const schedules = data.result.schedules
          .filter(function (schedule) {
            return !(schedule.message.match(/^Sans /) || schedule.message.match(/^Train Sans /));
          })
          .map(function (schedule) {
            schedule.message =  schedule.message.replace(/^Départ /, '')
            schedule.message =  schedule.message.replace(/^Train /, '')
            if (schedule.code) {
              schedule.message += " " + schedule.code;
            }
            //destination is useless here, does not show the actual end of the line
            // if (schedule.destination) {
            //   schedule.message += " " + schedule.destination;
            // }
            return schedule;
          });

        onSuccess(schedules);
      }
    },
    function (err) {
      if (!err) {
        err = 'http call error';
      }
      console.log("error in api-ratp call:" + err);
      onError(err);
    }
  );
}
module.exports = getNextRatpStops;

