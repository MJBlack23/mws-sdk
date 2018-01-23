'use strict';

const { convertToArray } = require('../../helpers/');

module.exports = async request => {
  let json = {};

  try {
    let Orders, NextToken;
    if (Object.keys(request).includes('ListOrdersResult')) {
      Orders = request.ListOrdersResult.Orders;
      NextToken = request.ListOrdersResult.NextToken;
    } else {
      Orders = request.ListOrdersByNextTokenResult.Orders;
      NextToken = request.ListOrdersByNextTokenResult.NextToken;
    }

    json = {
      Orders: convertToArray(Orders.Order),
      NextToken: NextToken || null
    };
  } catch (e) {
    console.log(e);
  } finally {
    return json;
  }

}