'use strict';

const { parseString } = require('xml2js');

module.exports = (xml, opts={}) => {
  return new Promise((resolve, reject) => {
    parseString(xml, opts, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  })
}