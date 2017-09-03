const expect = require('chai').expect;

//import global dependencies available through pebblejs
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
_ajax = require('../../node_modules/pebblejs/dist/js/lib/ajax.js');

var getNextSncfStops = require('./card-sncf-parser.js');


describe('the sncf next stop parser', function () {
  this.timeout(60000);

  it('should find a list of incoming trains from juvisy to bfm', function (done) {
    getNextSncfStops({
      title: 'Juvisy',
      direction: 'N',
      source: 87545244,
      destination: 87328328,
    }, function (trains) {
      // console.log(trains);
      console.log(JSON.stringify(trains));

      expect(trains).not.to.be.empty;
      done();

    }, done);

  });

  it('should find a list of incoming trains from juvisy ', function (done) {
    getNextSncfStops({
      title: 'Juvisy',
      direction: 'N',
      source: 87545244
    }, function (trains) {
      // console.log(trains);
      console.log(JSON.stringify(trains));

      expect(trains).not.to.be.empty;
      done();

    }, done);

  });

});

