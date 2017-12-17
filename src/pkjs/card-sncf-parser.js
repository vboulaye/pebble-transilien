// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}

const GaresTransilien = require('./gares/gares-transilien.js');

var SncfSecret;
try {
  SncfSecret = require('./card-sncf.secret.json');
} catch (e) {
  SncfSecret = {};
}

const Base64 = require('./base64.js');

const DOMParser = require('xmldom').DOMParser;
const domParser = new DOMParser();

function getNextSncfStops(station, onSuccess, onError) {

  var url;
  var source = GaresTransilien.getMatchingGare(station.source);
  var destination;
  if (station.destination) {
    destination = GaresTransilien.getMatchingGare(station.destination);
  }

  if (destination) {
    url = 'http://api.transilien.com/gare/' + source + '/depart/' + destination + '/';
  } else {
    url = 'http://api.transilien.com/gare/' + source + '/depart/' ;
  }
  console.log("api-sncf url:" + url);

  const login = SncfSecret.login;
  const password = SncfSecret.password;

  var request = {
    url: url,
    headers: {
      Authorization: "Basic " + Base64.encode(login + ":" + password),
      'Accept': 'application/xml; charset=utf-8'
    }
  };
  ajax(request,
    function (xmlData) {

      var trains = [];
      try {
        console.log("sncf:result " + xmlData);
        var doc = domParser.parseFromString(xmlData);
        var trainsXml = doc.getElementsByTagName('train');
        for (var i = 0; i < trainsXml.length; i++) {
          var trainXml = trainsXml.item(i);

          var train = {};
          for (var j = 0; j < trainXml.childNodes.length; j++) {
            var trainElementXml = trainXml.childNodes.item(j);
            if (trainElementXml.nodeType == 1) {
              train[trainElementXml.tagName] = trainElementXml.firstChild.data;
              for (var k = 0; k < trainElementXml.attributes.length; k++) {
                var attributeXml = trainElementXml.attributes.item(k);
                train[attributeXml.name] = attributeXml.value;
              }
            }
          }
          trains.push(train);
        }

        trains.forEach(function (train) {
          train.message = "";
          train.display = {};
          // extract the time
          if (train.date) {
            var dateParts = train.date.split(" ");
            if (dateParts.length > 1) {
              train.message += dateParts[1];
              train.display.time = dateParts[1];
            }
          }
          // append the mission
          train.message += " " + train.miss;
          train.display.mission = train.miss;

          train.display.etat = train.etat;

          if (train.etat) {
            train.message += " " + train.etat;

          } else {
            var gareTerminus = GaresTransilien[train.term];
            if (gareTerminus) {
              var destination = gareTerminus.libelle_sms_gare;
              destination = destination.replace(/VersaillesRG/, 'Vers. RG')
              destination = destination.replace(/VersaillesCh/, 'Vers. Ch')
              train.display.destination = gareTerminus.nom_gare;
              train.display.destinationShort = destination;
              train.message += ' ' + destination;//.substring(0,8);
            }
          }

        });


      } catch (e) {
        console.log("error during sncf api response parsing", e);
        onError(e);
        return;
      }

      onSuccess(trains);

    },
    function (err, status) {
      if (!err) {
        err = new Error('http call error (wrong user/password?): '+status);
      }
      console.log("error in api-sncf call:" + err);
      onError(err);
    }
  );
}


module.exports = getNextSncfStops;

