const { convertToArray } = require('../../helpers/');

module.exports = (request) => {
  try {
    const { ListOrderItemsResult: { OrderItems, AmazonOrderId } } = request;

    return {
      AmazonOrderId,
      OrderItems: convertToArray(OrderItems.OrderItem),
    };
  } catch (e) {
    throw e;
  }
};
