'use strict';

const { convertToArray } = require('../../helpers/');

module.exports = async request => {
  let json = {};

  try {
    const { ListOrdersResult: { Orders, NextToken } } = request;

    json = {
      NextToken,
      Orders: convertToArray(Orders.Order)
    };
  } catch (e) {
    console.log(e);
  } finally {
    return json;
  }

}