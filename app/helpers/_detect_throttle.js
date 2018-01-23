'use strict';

module.exports = response => {
  let throttled = false;

  if (response.Error && response.Error.Code === 'RequestThrottled') {
    throttled = true;
  }

  return throttled;
}