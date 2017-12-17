require('pebblejs');

const Clay = require('pebble-clay');
const clayConfig = require('./config.json');
const clay = new Clay(clayConfig);
const settings = JSON.parse(localStorage.getItem('clay-settings')) || {};

const CardTransilienInfo = require('./card-info.js');

const CardTrain = require('./card-train.js');
const SncfSchedule = require('./sncf-schedule.js');
const RatpSchedule = require('./ratp-schedule.js');
const CardClosestStations = require('./card-closest.js');

const CARDS = [];

// load nework info, showing the card if incidents are found
const cardTransilienInfo = new CardTransilienInfo();
cardTransilienInfo.refresh(function () {
    if (cardTransilienInfo.hasIncidents) {
        cardTransilienInfo.show();
    }
});

function mod(a, n) {
    return ((a % n) + n) % n;
}

function setupListeners(cardHolder) {
    var card = cardHolder.card;
    card.on('click', 'up', function (e) {
        var cardIndex = mod(cardHolder.cardIndex - 1, CARDS.length);
        CARDS[cardIndex].show();
        cardHolder.card.hide();
    });
    card.on('click', 'down', function (e) {
        var cardIndex = mod(cardHolder.cardIndex + 1, CARDS.length);
        CARDS[cardIndex].show();
        cardHolder.card.hide();
    });
    // card.on('click', 'select', function (e) {
    //   if (cardHolder.displayDetails) {
    //     cardHolder.displayDetails();
    //   } else {
    //     cardHolder.refresh();
    //   }
    // });
    card.on('longClick', 'select', function (e) {
        cardTransilienInfo.show();
    });

    card.on('longClick', 'up', function (e) {
        var closestStationsCard = new CardClosestStations();
        closestStationsCard.refresh();
        closestStationsCard.show();
    });

    cardHolder.refresh();


}


var STATIONS = [

    new CardTrain(new SncfSchedule({
        title: 'Juvisy',
        subtitle: 'BFM',
        source: 87545244,
        destination: 87328328,
        icon: 'ICON_RER_C',
    })),
    new CardTrain(new SncfSchedule({
        title: 'Juvisy',
        subtitle: 'St-Michel',
        source: 87545244,
        destination: 87547315,
        icon: 'ICON_RER_C',
    })),
    new CardTrain(new RatpSchedule({
        icon: 'ICON_RER_B',
        title: 'St-Michel',
        subtitle: 'Laplace',
        network: 'RER',
        line: 'B',
        source: 'saint+michel+notre+dame',
        direction: 'R'
    })),
    new CardTrain(new RatpSchedule({
        icon: 'ICON_RER_B',
        title: 'Laplace',
        subtitle: 'St-Michel',
        network: 'RER',
        line: 'B',
        source: 'laplace',
        direction: 'A'
    })),
    new CardTrain(new SncfSchedule({
        icon: 'ICON_RER_C',
        title: 'BFM',
        subtitle: 'Juvisy',
        direction: 'N',
        source: 87328328,
        destination: 87545244,
        // source: 'Austerlitz',
        // destination: 'Juvisy',
    })),
    new CardTrain(new SncfSchedule({
        title: 'Juvisy',
        subtitle: 'Ste-Gen',
        source: 87545244,
        destination: 87545210,
        icon: 'ICON_RER_C',
    })),
    new CardTrain(new SncfSchedule({
        title: 'Ste-Gen',
        subtitle: 'Juvisy',
        source: 87545210,
        destination: 87545244,
        icon: 'ICON_RER_C',
    })),
];


STATIONS.forEach(function (card) {
    card.cardIndex = CARDS.length;
    CARDS.push(card);
    setupListeners(card);
});


CARDS[0].show();
