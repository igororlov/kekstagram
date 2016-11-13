'use strict';

module.exports = function(list, from, to) {
  var page = [];
  if (from < list.length) {
    page = list.slice(from, to - 1);
  }
  return page;
};
