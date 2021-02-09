const _ = require('lodash');
const MWS = require('../MWS');

class OutboundShipments extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'POST',
      path: 'FulfillmentOutboundShipment',
      version: '2010-10-01',
      query: {},
    };

    this.createFulfillmentOrder = this.createFulfillmentOrder.bind(this);
  }

  /**
   * @param {string} params.SellerId - seller id on amazon marketplace
   * @param {string} params.SellerFulfillmentOrderId
   * @param {string} params.DisplayableOrderId
   * @param {string} params.DisplayableOrderDateTime
   * @param {string} params.ShippingSpeedCategory
   * @param {object} params.DestinationAddress
   * @param {string} params.DisplayableOrderComment
   * @param {array} params.Items
   */
  async createFulfillmentOrder(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'CreateFulfillmentOrder';
    request.form = true;

    try {
      /** Assign Seller ID */
      if (!params.SellerId) {
        request.query.SellerId = this.sellerId;
      } else {
        request.query.SellerId = params.SellerId;
      }

      if (!params.SellerFulfillmentOrderId || typeof params.SellerFulfillmentOrderId !== 'string') {
        throw new Error('SellerFulfillmentOrderId must be supplied and it must be a string');
      } else {
        request.query.SellerFulfillmentOrderId = params.SellerFulfillmentOrderId;
      }

      if (!params.ShippingSpeedCategory || typeof params.ShippingSpeedCategory !== 'string') {
        throw new Error('ShippingSpeedCategory must be supplied and it must be a string');
      } else {
        request.query.ShippingSpeedCategory = params.ShippingSpeedCategory;
      }

      if (!params.DisplayableOrderId || typeof params.DisplayableOrderId !== 'string') {
        throw new Error('DisplayableOrderId must be supplied and it must be a string');
      } else {
        request.query.DisplayableOrderId = params.DisplayableOrderId;
      }

      if (!params.DisplayableOrderDateTime || typeof params.DisplayableOrderDateTime !== 'string') {
        throw new Error('DisplayableOrderDateTime must be supplied and it must be a string');
      } else {
        request.query.DisplayableOrderDateTime = params.DisplayableOrderDateTime;
      }

      if (!params.DisplayableOrderComment || typeof params.DisplayableOrderComment !== 'string') {
        throw new Error('DisplayableOrderDateTime must be supplied and it must be a string');
      } else {
        request.query.DisplayableOrderComment = params.DisplayableOrderComment;
      }

      if (params.NotificationEmailList) {
        OutboundShipments.assignNotificationEmails(request, params.NotificationEmailList);
      }

      if (!params.DestinationAddress || typeof params.DestinationAddress !== 'object') {
        throw new Error('DestinationAdddress must be provided and be of type object');
      } else {
        OutboundShipments.assignAddress(request, params.DestinationAddress);
      }

      if (!params.Items || !Array.isArray(params.Items) || typeof params.Items[0] !== 'object') {
        throw new Error('Items must be provided as on array of items objects');
      } else {
        OutboundShipments.assignItems(request, params.Items);
      }

      const { headers, body } = await this.makeCall(request, true);

      const json = await OutboundShipments.XMLToJSON(body);

      return { headers, body: json };
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {string} params.SellerFulfillmentOrderId
   */

  async getFulfillmentOrder(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'GetFulfillmentOrder';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query.SellerId = this.sellerId;
    } else {
      request.query.SellerId = params.SellerId;
    }

    try {
      if (!params.SellerFulfillmentOrderId || typeof params.SellerFulfillmentOrderId !== 'string') {
        throw new Error('SellerFulfillemtnOrderId must be supplied and it must be of type string');
      } else {
        request.query.SellerFulfillmentOrderId = params.SellerFulfillmentOrderId;
      }

      const { headers, body } = await this.makeCall(request, true);

      const json = await OutboundShipments.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      return { headers, body: json };
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {int} params.PackageNumber Unencrypted package identifier
   * returned by GetFulfillmentOrder
   */
  async getPackageTrackingDetails(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'GetPackageTrackingDetails';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query.SellerId = this.sellerId;
    } else {
      request.query.SellerId = params.SellerId;
    }

    try {
      if (!params.PackageNumber || typeof params.PackageNumber !== 'number') {
        throw new Error('PackageNumber is required and must be of type int');
      } else {
        request.query.PackageNumber = params.PackageNumber;
      }

      const { headers, body } = await this.makeCall(request, true);

      const json = await OutboundShipments.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      return { headers, body: json };
    } catch (e) {
      throw e;
    }
  }

  async cancelFulfillmentOrder(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'CancelFulfillmentOrder';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query.SellerId = this.sellerId;
    } else {
      request.query.SellerId = params.SellerId;
    }

    try {
      if (!params.SellerFulfillmentOrderId || typeof params.SellerFulfillmentOrderId !== 'string') {
        throw new Error('SellerFulfillemtnOrderId must be supplied and it must be of type string');
      } else {
        request.query.SellerFulfillmentOrderId = params.SellerFulfillmentOrderId;
      }

      const { headers, body } = await this.makeCall(request, true);

      const json = await OutboundShipments.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      return { headers, body: json };
    } catch (e) {
      throw e;
    }
  }

  static assignAddress(request, address) {
    _.keys(address).forEach((key) => {
      if (address[key]) {
        request.query[`DestinationAddress.${key}`] = address[key];
      }
    });

    return request;
  }

  static assignItems(request, items) {
    items.forEach((item, i) => {
      const itemNumber = i + 1;
      _.keys(item).forEach((key) => {
        if (item[key]) {
          request.query[`Items.member.${itemNumber}.${key}`] = item[key];
        }
      });

      return request;
    });
  }

  static assignNotificationEmails(request, emails) {
    emails.forEach((email, i) => {
      const emailId = i + 1;
      request.query[`NotificationEmailList.member.${emailId}`] = email;
    });

    return request;
  }
}

module.exports = OutboundShipments;
