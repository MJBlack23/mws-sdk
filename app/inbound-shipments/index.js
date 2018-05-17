const _ = require('lodash');
const MWS = require('../MWS');

class InboundShipments extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'GET',
      path: 'FulfillmentInboundShipment',
      version: '2010-10-01',
      query: {},
    };
  }

  /**
   * @param {string} params.SellerId - seller id on amazon marketplace
   * @param {string} params.LabelPrepPreference - prep preference for inbound shipments
   * @param {object} params.ShipFromAddress - object that contains the ship from name, address, city, state, postal code, and country code
   * @param {array} params.InboundShipmentPlanRequestItems - array of objects that contain the items sellerSKU, quantity, prep Instructions, and prep owner
   */
  async createInboundShipmentPlan(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'CreateInboundShipmentPlan';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query['SellerId'] = this.sellerId;
    } else {
      request.query['SellerId'] = params.SellerId;
    }
    try {
      /** Assign the Prep Preference if it was provided */
      if (params.LabelPrepPreference && typeof params.LabelPrepPreference !== 'string') {
        throw new Error('params.LabelPrepPreference must be a string if provided');
      } else {
        request.query['LabelPrepPreference'] = params.LabelPrepPreference;
      }

      /** Assign the Ship From Address */
      if (!params.ShipFromAddress) {
        throw new Error('params.ShipFromAddress must be provided.');
      } else if (typeof params.ShipFromAddress !== 'object') {
        throw new Error('parms.ShipFromAddress must be an object.');
      } else {
        _.keys(params.ShipFromAddress).forEach((key, i) => {
          let itemNumber = i + 1;
          if (typeof params.ShipFromAddress[key] === 'string') {
            request.query[`ShipFromAddress.${key}`] = params.ShipFromAddress[key];
          }
        });
      }

      /** Assign the Inbound Shipment Plan Items */
      if (!params.InboundShipmentPlanRequestItems) {
        throw new Error('params.InboundShipmentPlanRequestItems must be provided.');
      } else if (typeof params.InboundShipmentPlanRequestItems !== 'object') {
        throw new Error('params.InboundShipmentPlanRequestItems must be an array');
      } else {
        InboundShipments.assignItems(request, params.InboundShipmentPlanRequestItems);
      }

      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);
      // const response = await this.makeCall(request, true);

      // /** Convert the XML to JSON */
      const json = await InboundShipments.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      return { headers, body: json };
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * @param {string} params.SellerId - seller id on amazon marketplace
   * @param {string} params.LabelPrepPreference - prep preference for inbound shipments
   * @param {object} params.ShipFromAddress - object that contains the ship from name, address, city, state, postal code, and country code
   * @param {array}  params.InboundShipmentPlanRequestItems - array of objects that contain the items sellerSKU, quantity
   * @param {string} params.ShipmentId - the id for the shipment returned from the createInboundShipmentPlan call
   * @param {string} params.DestinationFulfillmentCenterId - the id returned from the createInboundShipmentPlan call
   * @param {string} params.ShipmentStatus - Status of the shipment.
   * @param {string} params.IntendedBoxContentsSource
   */
  async createInboundShipment(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'CreateInboundShipment';

    request.query['InboundShipmentHeader.ShipmentStatus'] = 'WORKING';
    request.query['InboundShipmentHeader.IntendedBoxContentsSource'] = 'FEED';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query.SellerId = this.sellerId;
    } else {
      request.query.SellerId = params.SellerId;
    }

    try {
      if (!params.ShipmentId) {
        throw new Error('ShipmentId is required');
      } else if (typeof params.ShipmentId !== 'string') {
        throw new Error('ShipmentId must be a string');
      } else {
        request.query.ShipmentId = params.ShipmentId;
      }


      /** Check the inbound shipment header type */
      if (params.InboundShipmentHeader && typeof params.InboundShipmentHeader !== 'object') {
        throw new Error('params.LabelPrepPreference must be an object');
      }

      /** Assign the Ship From Address */
      if (!params.InboundShipmentHeader.ShipFromAddress) {
        throw new Error('InboundShipmentHeader.ShipFromAddress must be provided.');
      } else if (typeof params.InboundShipmentHeader.ShipFromAddress !== 'object') {
        throw new Error('InboundShipmentHeader.ShipFromAddress must be an object.');
      } else {
        _.keys(params.InboundShipmentHeader.ShipFromAddress).forEach((key) => {
          if (typeof params.InboundShipmentHeader.ShipFromAddress[key] === 'string') {
            request.query[`InboundShipmentHeader.ShipFromAddress.${key}`] = params.InboundShipmentHeader.ShipFromAddress[key];
          }
        });
      }

      if (!params.InboundShipmentHeader.ShipmentName) {
        throw new Error('ShipmentName is required');
      } else if (typeof params.InboundShipmentHeader.ShipmentName !== 'string') {
        throw new Error('ShipmentName must be a string');
      } else {
        request.query['InboundShipmentHeader.ShipmentName'] = params.InboundShipmentHeader.ShipmentName;
      }

      if (!params.InboundShipmentHeader.DestinationFulfillmentCenterId) {
        throw new Error('DestinationFulfillmentCenterId is required');
      } else if (typeof params.InboundShipmentHeader.DestinationFulfillmentCenterId !== 'string') {
        throw new Error('DetinationFulfillmentCenterId must be a string');
      } else {
        request.query['InboundShipmentHeader.DestinationFulfillmentCenterId'] = params.InboundShipmentHeader.DestinationFulfillmentCenterId;
      }

      if (!params.InboundShipmentHeader.LabelPrepPreference) {
        throw new Error('LabelPrepPreference is required');
      } else if (typeof params.InboundShipmentHeader.LabelPrepPreference !== 'string') {
        throw new Error('LabelPrepPreference must be a string');
      } else {
        request.query['InboundShipmentHeader.LabelPrepPreference'] = params.InboundShipmentHeader.LabelPrepPreference;
      }

      /** Assign the Inbound Shipment Plan Items */
      if (!params.InboundShipmentPlanRequestItems) {
        throw new Error('params.InboundShipmentPlanRequestItems must be provided.');
      } else if (typeof params.InboundShipmentPlanRequestItems !== 'object') {
        throw new Error('params.InboundShipmentPlanRequestItems must be an array');
      } else {
        InboundShipments.assignItems(request, params.InboundShipmentPlanRequestItems);
      }

      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await InboundShipments.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      /** Return the parsed response */
      return { headers, body: json };
    } catch (e) {
      console.log(e);
    }
  }

  async listInboundShipments(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'ListInboundShipments';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query['SellerId'] = this.sellerId;
    } else {
      request.query['SellerId'] = params.SellerId;
    }

    request.query['ShipmentStatusList.member.1'] = 'WORKING';

    /** Make the Call */
    let response = await this.makeCall(request);

    /** Convert the XML to JSON */
    response = await InboundShipments.XMLToJSON(response);

    if (response['$']) {
      delete response['$'];
    }

    /** Return the parsed response */
    return response;
  }

  static assignItems(request, items) {
    let itemNumber;
    items.forEach((item, i) => {
      itemNumber = i + 1;
      _.keys(item).forEach((key) => {
        request.query[`InboundShipmentPlanRequestItems.member.${itemNumber}.${key}`] = item[key];
      });
    });

    return request;
  }
}

module.exports = InboundShipments;
