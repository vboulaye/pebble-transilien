const expect = require('chai').expect;

const GaresTransilien = require('./gares-transilien.js');


describe('the transilien gares ', function () {
  this.timeout(60000);

  it('should contain a list of gares', function () {
    expect(GaresTransilien.gares).not.to.be.empty;
  });


  it('should know juvisy', function () {
    expect(GaresTransilien[87545244].libelle_sms_gare).to.equal('Juvisy');
  });

  it('should find a gare id byt its name', function () {
    expect(GaresTransilien.getMatchingGare('Juvisy')).to.equal('87545244');
    expect(GaresTransilien.getMatchingGare('Austerlitz')).to.equal('87547026');
    expect(GaresTransilien.getMatchingGare('Mitterrand')).to.equal('87328328');
    expect(GaresTransilien.getMatchingGare('GENTILLY')).to.equal('87758656');

  });

});


