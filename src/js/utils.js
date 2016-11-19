'use strict';

function throttle(fn, delay) {
  delay = delay || 100;
  var waiting = false;
  return function() {
    if (!waiting) {
      fn.call();
      waiting = true;
      setTimeout(function() {
        waiting = false;
      }, delay);
    }
  };
}

module.exports = {
  throttle: throttle
};
