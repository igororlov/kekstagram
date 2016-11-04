'use strict';

var getDataViaJSONP = function(url, callback, callbackName) {

  if (!callbackName) {
    callbackName = 'cb' + Date.now();
  }

  window[callbackName] = function(data) {
    callback(data);
  };

  var script = document.createElement('script');
  script.src = url + '?callback=' + callbackName;
  document.body.appendChild(script);
};

module.exports = getDataViaJSONP;
