const MWS = require('../MWS');
const _ = require('lodash');

class MerchantFulfillment extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'GET',
      path: 'MerchantFulfillment',
      version: '2015-06-01',
      query: {},
    };

    /** Bind context */
  }

  /**
   * @param {object} params.ShipmentRequestDetails - Required - Shipment information required for requesting shipping service offers or for creating a shipment
   * @param {string} params.ShipmentRequestDetails.AmazonOrderId - Required - Amazon Order Identifier
   * @param {string} params.ShipmentRequestDetails.SellerOrderId  - Optional - Seller defined order identifier
   * @param {array}  params.ShipmentRequestDetails.ItemList - Required - List of items to be included in a shipment
   * @param {object} params.ShipmentRequestDetails.ShipFromAddress - Required - The address from which the shipment ships
   * @param {object} params.ShipmentRequestDetails.PackageDimensions - Required - The package dimensions
   * @param {object} params.ShipmentRequestDetails.Weight - Required - The package weight
   * @param {string} params.ShipmentRequestDetails.MustArriveByDate - Optional - The date by which the package must arrive to keep the promise to the customer
   * @param {string} params.ShipmentRequestDetails.ShipDate - Optional - The date the seller wants to ship the package
   * @param {object} params.ShipmentRequestDetails.ShippingServiceOptions - Required - Extra services offered by the carrier
   * @param {object} params.ShipmentRequestDetails.LabelCustomization  - Optional - Label Customization Options
   */
  async getEligibleShippingServices(params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetEligibleShippingServices';
    request.query.MarketplaceId = this.marketplaceId;

    try {
      if (!params.ShipmentRequestDetails || typeof params.ShipmentRequestDetails !== 'object') {
        throw new Error('Shipment Request Details are required.');
      }
      const { ShipmentRequestDetails } = params;
      _.keys(ShipmentRequestDetails).forEach((key) => {
        if (typeof ShipmentRequestDetails[key] === 'string') {
          request.query[`ShipmentRequestDetails.${key}`] = ShipmentRequestDetails[key];
        } else if (key === 'ItemList') {
          const items = ShipmentRequestDetails[key];
          MerchantFulfillment.assignItems(request, items, 'ShipmentRequestDetails');
        } else {
          const object = ShipmentRequestDetails[key];
          MerchantFulfillment.assignParams(request, object, key, 'ShipmentRequestDetails');
        }
      });

      const { headers, body } = await this.makeCall(request, true);

      const json = await MerchantFulfillment.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      return { headers, body: json };
    } catch (e) {
      throw e;
    }
  }

  static assignParams(request, object, child, parent) {
    _.keys(object).forEach((key) => {
      request.query[`${parent}.${child}.${key}`] = object[key];
    });

    return request;
  }

  static assignItems(request, items, parent) {
    items.forEach((item, i) => {
      const ItemNum = i + 1;
      request.query[`${parent}.ItemList.Item.${ItemNum}.OrderItemId`] = item.OrderItemId;
      request.query[`${parent}.ItemList.Item.${ItemNum}.Quantity`] = item.Quantity;
    });

    return request;
  }
}

module.exports = MerchantFulfillment;
