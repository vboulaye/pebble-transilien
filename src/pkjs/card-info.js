const UI = require('pebblejs/ui');
const Feature = require('pebblejs/platform/feature');

const getTransilienInfo = require('./transilien-info.js');

function CardTransilienInfo() {

  const self = this;
  console.log('init CardTransilienInfo: ');

  this.card = new UI.Menu({
    backgroundColor: 'black',
    textColor: 'white',
    highlightBackgroundColor: Feature.color('orange', 'white'),
    highlightTextColor: Feature.color('white', 'black'),
//    scrollable: false,
//    status: false
    status: {
      color: 'white',
      backgroundColor: 'black',
      separator: 'none',
    },
  });

  // handle menu item selection
  this.card.on('select', function (event) {
    if (!(event.item.title === 'Traffic normal')) {
      const detailsCard = new UI.Card({
          backgroundColor: Feature.color('red', 'white'),
          title: event.item.title,
          body: event.item.subtitle,
          status: {
            color: 'black',
            backgroundColor: Feature.color('red', 'white'),
            separator: 'none',
          },
        })
      ;
      detailsCard.show();
    }
  });

  this.card.on('longSelect', function () {
    self.refresh();
  });

  this.card.on('show', function () {
   // self.refresh();
  });

  this.card.on('hide', function () {
    // self.refresh();
  });
}


CardTransilienInfo.prototype.preRefreshContents = function () {
  this.card.sections([{
    title: 'Chargement...'
  }]);
};


function buildIncidentItems(network, lines) {
  var items = lines
    .filter(function (line) {
      return line.slug.indexOf('normal') === -1;
    })
    .map(function (line) {
      return {
        title: network + line.line,
        subtitle: line.message,
      }
    });

  return items;

}

CardTransilienInfo.prototype.refreshContents = function (info) {
  const self = this;
  var sections = [];

  self.hasIncidents = false;

  if (info.rers) {
    sections.push({
      title: 'RER',
      items: buildIncidentItems('RER ', info.rers)
    })
  }

  if (info.metros) {
    sections.push({
      title: 'Metro',
      items: buildIncidentItems('M', info.metros)
    })
  }

  if (info.tramways) {
    sections.push({
      title: 'Tramway',
      items: buildIncidentItems('T', info.tramways)
    })
  }

  sections.forEach(function(section) {
    if (section.items.length === 0 ) {
      section.items = [{title: 'Traffic normal'}];
    } else {
      self.hasIncidents = true;
    }
  });


  // console.log('sections: ' + JSON.stringify(sections));
  self.card.sections(sections);

  // needed to trigger a refresh
  sections.forEach(function (section, idx) {
    self.card.section(idx, section);
  });

};

CardTransilienInfo.prototype.refreshError = function (error) {
  this.card.sections([{title: error}]);
};

CardTransilienInfo.prototype.refresh = function (onSuccess, onError) {

  const self = this;
  self.preRefreshContents();

  getTransilienInfo(function (info) {
    self.refreshContents(info)
    if (onSuccess) {
      onSuccess(info);
    }
  }, function (err) {
    self.refreshError(err);
    if (onError) {
      onError(err);
    }
  });

};

CardTransilienInfo.prototype.show = function () {
  this.card.show();
};

module.exports = CardTransilienInfo;
