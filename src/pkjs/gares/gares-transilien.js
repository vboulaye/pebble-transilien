const garesSncfJson = require('./gares-transilien.json');

/*
*  load the list of sncf gares
*  they are available as the gare array, and can be searched by their uic code
*
*  useful fields:
*  code_uic :  the code to use in the api
*  libelle_sms_gare: the short label for the gare
*
*
 */
const GaresSncf = {};

// accept either an [] (file download from sncf site) or an [] in the records field (api response)
const garesSncfArray = garesSncfJson.records ? garesSncfJson.records : garesSncfJson;

const gares = garesSncfArray.map(function (gareSncf) {

  const gare = gareSncf.fields;
  // allow search by code uic
  GaresSncf[gareSncf.fields.code_uic] = gare;
  return gare;
});

GaresSncf.gares = gares;


GaresSncf.getMatchingGare = function getMatchingGare(sourceParam) {
  var self =this;
  var source = sourceParam;
  // if the source is not a valid uic code, search by name
  if (!self[source]) {
    const matchingGares  = self.gares
      .filter(function (gare){
        var gareName = gare.libelle || gare.nom_gare;
        return gareName.toLowerCase().indexOf(source.toLowerCase())>=0;
      });
    //console.log("found matching gares for ", source,": ", matchingGares);
    if (matchingGares.length>0) {
      source = matchingGares[0].code_uic
    }
  }
  return source;

}

module.exports = GaresSncf;