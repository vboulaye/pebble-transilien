// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}

var GaresSncf = require('./card-sncf-gares.js');
var SncfSecret = require('./card-sncf.secret.json');
var Base64 = require('./base64.js');

var DOMParser = require('xmldom').DOMParser;

function getNextSncfStops(station, onSuccess, onError) {

  var source = GaresSncf.getMatchingGare(station.source);
  var destination = GaresSncf.getMatchingGare(station.destination);

  const url = 'http://api.transilien.com/gare/' + source + '/depart/' + destination + '/';
  console.log("api-sncf url:" + url);

  const login = SncfSecret.login;
  const password = SncfSecret.password;

  ajax({
      url: url,
      headers: {
        Authorization: "Basic " + Base64.encode(login + ":" + password),
      }
    },
    function (xmlData) {
      try {
        console.log("sncf:result " + xmlData);
        var doc = new DOMParser().parseFromString(xmlData);
        var trainsXml = doc.getElementsByTagName('train');
        var trains = [];
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
          // extract the time
          if (train.date) {
            var dateParts = train.date.split(" ");
            if (dateParts.length > 1) {
              train.message += dateParts[1];
            }
          }
          // append the mission
          train.message += " " + train.miss;

          if (train.etat) {
            train.message += " " + train.etat;
          } else {
            var gareTerminus = GaresSncf[train.term];
            if (gareTerminus) {
              var destination = gareTerminus.libelle_sms_gare;
              destination = destination.replace(/VersaillesRG/, 'Vers. RG')
              destination = destination.replace(/VersaillesCh/, 'Vers. Ch')
              train.message += " " + destination;//.substring(0,8);
            }
          }

        });

        onSuccess(trains);
      } catch (e) {
        console.log("error during sncf api response parsing", e);
        onError(e);
      }
    },
    function (err) {
      if (!err) {
        err = 'http call error';
      }
      console.log("error in api-sncf call:" + err);
      onError(err);
    }
  );
}


module.exports = getNextSncfStops;

