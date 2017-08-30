
const expect = require('chai').expect;

//import global dependencies available through pebblejs
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
_ajax = require('../../node_modules/pebblejs/dist/js/lib/ajax.js');

var getNextSncfStops = require('./card-sncf-parser.js');



describe('the sncf next stop parser', function () {
  this.timeout(60000);

  xit('should find a list of incoming trains from juvisy to bfm', function (done) {
    getNextSncfStops( {
      title: 'Juvisy',
      direction: 'N',
      source: 87393009,
      destination: 87393033,
    }, function(trains) {
      console.log(trains);

      expect(trains).not.to.be.empty;
      done();

    },done);

  });




});

