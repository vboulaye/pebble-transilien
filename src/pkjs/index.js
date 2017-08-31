require('pebblejs');

var Clay = require('pebble-clay');
var clayConfig = require('./config.json');
var clay = new Clay(clayConfig);

var UI = require('pebblejs/ui');

var CardRatp = require('./card-ratp.js');
var CardSncf= require('./card-sncf.js');

var settings = JSON.parse(localStorage.getItem('clay-settings')) || {};

var CARDS = [];

function mod(a, n) {
  return ((a % n) + n) % n;
}

function setupListeners(cardHolder) {
  var card = cardHolder.card;
  card.on('click', 'up', function (e) {
    var cardIndex = mod(cardHolder.cardIndex - 1, CARDS.length);
    CARDS[cardIndex].show();
  });
  card.on('click', 'down', function (e) {
    var cardIndex = mod(cardHolder.cardIndex + 1, CARDS.length);
    CARDS[cardIndex].show();
  });
  card.on('click', 'select', function (e) {
    cardHolder.refresh();
  });
  cardHolder.refresh();
}


var STATIONS = [
  new CardSncf( {
    icon: 'ICON_RER_C',
    title: 'Juvisy',
    subtitle: 'BFM',
    direction: 'N',
    source: 87545244,
    destination: 87328328,
  })
  ,
  new CardRatp({
    icon: 'ICON_RER_B',
    title: 'St-Michel',
    subtitle: 'Laplace',
    network: 'RER',
    line: 'B',
    source: 'saint+michel+notre+dame',
    direction: 'R'
  }),
  new CardRatp({
    icon: 'ICON_RER_B',
    title: 'Laplace',
    subtitle: 'St-Michel',
    network: 'RER',
    line: 'B',
    source: 'laplace',
    direction: 'A'
  }),
  new CardSncf( {
    icon: 'ICON_RER_C',
    title: 'Austerlitz',
    subtitle: 'Juvisy',
    direction: 'N',
    source: 'Austerlitz',
    destination: 'Juvisy',
  })
];



STATIONS.forEach(function (card) {
  card.cardIndex = CARDS.length;
  CARDS.push(card);
  setupListeners(card);
});



CARDS[0].show();
