'use strict';

var filterToParams = function(filterObj) {
  var params = [];
  for (var key in filterObj) {
    if (filterObj.hasOwnProperty(key) && typeof filterObj[key] !== 'undefined' && filterObj[key] !== null) {
      params.push(key + '=' + filterObj[key]);
    }
  }
  return '?' + params.join('&');
};

var load = function(url, filterObj, callback) {
  console.log('in load, filterObj', filterObj);

  var xhr = new XMLHttpRequest();
  var fullUrl = url + filterToParams(filterObj);

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };
  xhr.open('GET', fullUrl, true);
  xhr.send();
};

module.exports = load;
