const expect = require('chai').expect;

//import global dependencies available through pebblejs
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
_ajax = require('../../../node_modules/pebblejs/dist/js/lib/ajax.js');

navigator = {
  geolocation: {
    getCurrentPosition: function (onSuccess, onError, options) {
          onSuccess({coords:{latitude: 48.6844685, longitude: 2.3862227}});
    }
  }
};

var getClosestStations = require('./closest-station.js');


describe('the sncf get closests station ', function () {
  this.timeout(60000);

  it('should find a list of close by stations', function (done) {
    getClosestStations(
      function (stations) {
        console.log(JSON.stringify(stations));

        expect(stations).not.to.be.empty;
        done();

      }, done);

  });


});

