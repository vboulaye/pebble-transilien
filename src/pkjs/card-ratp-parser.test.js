
const expect = require('chai').expect;

//import global dependencies available through pebblejs
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
_ajax = require('../../node_modules/pebblejs/dist/js/lib/ajax.js');
_moment = require('../../node_modules/pebblejs/dist/js/vendor/moment.js');

var getNextRatpStops = require('./card-ratp-parser.js');


describe('the ratp next stop parser', function () {
  this.timeout(60000);

  it('should find a list of incoming trains from laplace to st michel', function (done) {
    getNextRatpStops( {
      icon: 'ICON_RER_B',
      title: 'Laplace',
      subtitle: 'St Michel',
      network: 'RER',
      line: 'B',
      source: 'laplace',
      direction: 'A'
    }, function(trains) {
      console.log(trains);

      expect(trains).not.to.be.empty;
      done();

    },done);

  });




});

