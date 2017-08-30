
const expect = require('chai').expect;

const GaresSncf = require ('./card-sncf-gares.js');


describe('the sncf gares ', function () {
  this.timeout(60000);

  it('should contain a list of gares', function () {
    expect(GaresSncf.gares).not.to.be.empty;
  });


  it('should know juvisy', function () {
    expect(GaresSncf[87545244].libelle_sms_gare).to.equal('Juvisy');
  });

  it('should find a gare id byt its name', function () {
    expect(GaresSncf.getMatchingGare( 'Juvisy')).to.equal('87545244');
    expect(GaresSncf.getMatchingGare( 'Austerlitz')).to.equal('87547026');
    expect(GaresSncf.getMatchingGare( 'Mitterrand')).to.equal('87328328');

  });

});


