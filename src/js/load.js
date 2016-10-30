'use strict';

module.exports = function(url, callback) {
  var callbackName = 'cb' + Date.now();

  window[callbackName] = function(data) {
    callback(data);
  }

  var script = document.createElement('script');
  script.src = url + '?callback=' + callbackName;
  document.body.appendChild(script);
}
