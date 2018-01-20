'use strict';

const { convertToArray } = require('../../helpers/');

module.exports = async request => {
  let json = {};

  try {
    const { ListOrdersResult: { Orders } } = request;

    json = convertToArray(Orders.Order);
  } catch (e) {
    console.log(e);
  } finally {
    return json;
  }

}