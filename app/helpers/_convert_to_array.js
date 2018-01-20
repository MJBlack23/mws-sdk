'use strict';

const _ = require('lodash');

module.exports = object => {
  if (!object) {
    return [];
  } else if (_.keys(object)[0] === '0') {
    return object;
  } else {
    return [object];
  }
}