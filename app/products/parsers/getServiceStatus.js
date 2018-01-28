'use strict';

module.exports = response => {
  let json = {};

  try {
    let { GetServiceStatusResult: { Status, Timestamp } } = response;

    json = {
      Status,
      Timestamp
    }
  } catch (e) {
    console.log(e);
  }

  return json;
}