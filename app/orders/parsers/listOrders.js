const { convertToArray } = require('../../helpers/');

module.exports = (request) => {
  try {
    let Orders;
    let NextToken;
    if (Object.keys(request).includes('ListOrdersResult')) {
      Orders = request.ListOrdersResult.Orders;
      NextToken = request.ListOrdersResult.NextToken;
    } else {
      Orders = request.ListOrdersByNextTokenResult.Orders;
      NextToken = request.ListOrdersByNextTokenResult.NextToken;
    }

    return {
      Orders: convertToArray(Orders.Order),
      NextToken: NextToken || null,
    };
  } catch (e) {
    throw e;
  }
};
