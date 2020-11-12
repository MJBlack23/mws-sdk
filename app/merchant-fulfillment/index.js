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

  /**
   * @param {string} params.OrderId - Required - Amaonz defined order id.
   * @param {string} params.ShippingServiceId - Required - The identifer for the carrier shipping serive that the seller chose.
   * This was returned by a call to GetEligibleShippingServices
   * @param {object} params.ShipFromAddress - Required - The address from which the shipment ships.
   */
  getAdditionalSellerInputs(params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetAdditionalSellerInputs';
    request.query.MarketplaceId = this.marketplaceId;

    try {
      if (!params.OrderId || !params.ShippingServiceId || !params.ShipFromAddress) {
        throw new Error('Order Id, Shipping Service Id, and Ship from Address are all required for this operation');
      } else if (typeof params.OrderId !== 'string') {
        throw new Error('Order id must be a string and a valid amazon order id');
      } else if (typeof params.ShippingServiceId !== 'string') {
        throw new Error('Shipping service id must be a string a valid shipping service id returned from GetEligibleShippingServices');
      } else if (typeof params.ShipFromAddress !== 'object') {
        throw new Error('Ship from Address must be an object and an MWS Address Type');
      }

      request.query.OrderId = params.OrderId;
      request.query.ShippingServiceId = params.ShippingServiceId;
      request.query.ShipFromAddress = MerchantFulfillment.assignParams(request, params, 'ShipFromAddress')
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {string} params.ShipmentId - Required - amazon defined shipment identifier
   */
  async getShipment(params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetShipment';
    request.query.MarketplaceId = this.marketplaceId;

    try {
      if (!params.ShipmentId) {
        throw new Error('Shipment Id is required for this operation');
      }

      request.query.ShipmentId = params.ShipmentId;

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

   /**
   * @param {string} params.ShipmentId - Required - amazon defined shipment identifier
   */
  async cancelShipment(params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'Cancel Shipment';
    request.query.MarketplaceId = this.marketplaceId;

    try {
      if (!params.ShipmentId) {
        throw new Error('Shipment Id is required for this operation');
      }

      request.query.ShipmentId = params.ShipmentId;

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

  /**
   * @param {object} params.ShipmentRequestDetails - Required - Shipment information required for creating a shipment
   * @param {string} params.ShippingServiceId - Required - An Amazon-defined shipping service identifier.
   * This is the returned id of the selected shipping service resulting from the GetEligibleShippingServices call
   * @param {object} params.HazmatType - Optional - Hazardous materials options for a package
   * @param {string} params.LabelFormatOption - Optional - Label options
   * @param {object} params.ShipmentLevelSellerInputsList - Optional - A list of additional seller inputs, at the shipment level.
   */
  async createShipment(params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'CreateShipment';
    request.query.MarketplaceId = this.marketplaceId;

    try {
      if (!params.ShipmentRequestDetails || !params.ShippingServiceId) {
        throw new Error('Shipment Request Details and Shipping Service Id are required for this operation');
      } else if (typeof params.ShipmentRequestDetails !== 'object') {
        throw new Error('Shipment Request details is an object. Please refer to MWS documentation');
      } else if (typeof params.ShippingServiceId !== 'string') {
        throw new Error('Shipment Service Id must be a string type and must be a valid id returned from Amazon');
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
