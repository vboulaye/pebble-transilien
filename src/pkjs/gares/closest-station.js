// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}

const DISTANCE = 5000;
const STATIONS_NUMBER = 10;

/**
 * get teh closesys station from the sncf data set.
 * gare_non_sncf = 1  pour les gares ratp et 0 pour la sncf
 *
 * pour une gare sncf on utilisera le code_uic
 *
 * pour le libelle nom_gare ou libelle_sms_gare pour le libelle court
 *
 * @param onSuccess
 * @param onError
 */

function getClosestStations(onSuccess, onError) {

// Request current position
  navigator.geolocation.getCurrentPosition(function (pos) {
    // console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
    const url = 'https://ressources.data.sncf.com/api/records/1.0/search' +
      '?dataset=sncf-gares-et-arrets-transilien-ile-de-france' +
      '&rows=' + STATIONS_NUMBER +
      '&geofilter.distance=' + pos.coords.latitude + ',' + pos.coords.longitude + ',' + DISTANCE;
    console.log('url= ' + url);

    ajax({
        url: url,
        type: 'json',
      },
      function (data) {
        if (data.records) {
          const stations = data.records
            .map(function (record) {
              return record.fields;
            });
          onSuccess(stations);
        } else {
          onError("no data found for geoloc " + JSON.stringify(pos.coords));
        }

      }, onError);
  }, onError, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  });

}

module.exports = getClosestStations;

