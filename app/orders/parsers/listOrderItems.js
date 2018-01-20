'use strict';

const { convertToArray } = require('../../helpers/');

module.exports = async request => {
  let json = {};

  try {
    const { ListOrderItemsResult: { OrderItems, AmazonOrderId } } = request;

    json = {
      AmazonOrderId,
      OrderItems: convertToArray(OrderItems.OrderItem)
    }
  } catch (e) {
    console.log(e);
  } finally {
    return json;
  }

}