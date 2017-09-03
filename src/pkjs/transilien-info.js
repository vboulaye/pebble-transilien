// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}

function getTransilienInfo(lineRequest, onSuccess, onError) {

  // handle the case when the request is not provided (we want all lines)
  if (typeof lineRequest === "function") {
    onError = onSuccess;
    onSuccess = lineRequest;
    lineRequest = null;
  }
  const NETWORK_MAPPINGS = {
    RER: 'rers',
    M: 'metros'
  };

  var url = "https://api-ratp.pierre-grimaud.fr/v3/traffic";
  if (lineRequest && lineRequest.network) {
    url += '/' + NETWORK_MAPPINGS[lineRequest.network];
    if (lineRequest.line) {
      url += '/' + lineRequest.line;
    }
  }

  console.log("api-ratp traffic url:" + url);

  ajax({
      url: url,
      type: 'json'
    },
    function (data) {
      // console.log('traffic response: ' + JSON.stringify(data));
      if (data.result) {
        const info = data.result;
        onSuccess(info);
      }
    },
    function (err) {
      if (!err) {
        err = 'http call error';
      }
      console.log("error in api-ratp traffic call:" + err);
      onError(err);
    }
  );
}

module.exports = getTransilienInfo;

