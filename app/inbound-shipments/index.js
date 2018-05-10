const _ = require('lodash');
const MWS = require('../MWS');

class InboundShipments extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'POST',
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

    /** Assign the Prep Preference if it was provided */
    if (params.LabelPrepPreference && typeof params.LabelPrepPreference !== 'string') {
      throw new Error('params.LabelPrepPreference must be a string if provided');
    } else {
      params.query['LabelPrepPreference'] = params.LabelPrepPreference;
    }

    /** Assign the Ship From Address */
    if (!params.ShipFromAddress) {
      throw new Error('params.ShipFromAddress must be provided.');
    } else if (typeof params.ShipFromAddress !== 'object') {
      throw new Error('parms.ShipFromAddress must be an object.');
    } else {
      request.query['ShipFromAddress.Name'] = params.ShipFromAddress.Name;
      request.query['ShipFromAddress.AddressLine1'] = params.ShipFromAddress.AddressLine1
      request.query['ShipFromAddress.City'] = params.ShipFromAddress.City;
      request.query['ShipFromAddress.StateOrProvinceCode'] = params.ShipFromAddress.StateOrProvinceCode;
      request.query['ShipFromAddress.PostalCode'] = params.ShipFromAddress.PostalCode;
      request.query['ShipFromAddress.CountryCode'] = params.ShipFromAddress.CountryCode

      if (params.ShipFromAddress.AddressLine2) {
        params.query['ShipFromAddress.AddressLine2'] = params.ShipFromAddress.AddressLine2;
      }
    }

    /** Assign the Inbound Shipment Plan Items */
    if (!params.InboundShipmentPlanRequestItems) {
      throw new Error('params.InboundShipmentPlanRequestItems must be provided.');
    } else if (typeof params.InboundShipmentPlanRequestItems !== 'object') {
      throw new Error('params.InboundShipmentPlanRequestItems must be an array');
    } else {
      _.keys(params.InboundShipmentPlanRequestItems).forEach((key, i) => {
        let itemNumber = i + 1;
        if (typeof params.InboundShipmentPlanRequestItems[key] === 'string') {
          request.query[`InboundShipmentPlanRequestItems.member.${itemNumber}.${key}`] = params.InboundShipmentPlanRequestItems[key];
        }
      });
    }

    /** Make the Call */
    let response = await this.makeCall(request);

    /** Convert the XML to JSON */
    response = await InboundShipments.XMLToJSON(body);

    /** Return the parsed response */
    return response;
  }

  /**
   * @param {string} params.SellerId - seller id on amazon marketplace
   * @param {string} params.LabelPrepPreference - prep preference for inbound shipments
   * @param {object} params.ShipFromAddress - object that contains the ship from name, address, city, state, postal code, and country code
   * @param {array}  params.InboundShipmentPlanRequestItems - array of objects that contain the items sellerSKU, quantity, prep Instructions, and prep owner
   * @param {string} params.ShipmentId - the id for the shipment returned from the createInboundShipmentPlan call
   * @param {string} params.DestinationFulfillmentCenterId - the id for the destination fulfillment center returned from the createInboundShipmentPlan call
   * @param {string} params.ShipmentStatus - Status of the shipment.
   * @param !!!!!!
   */
  async createInboundShipment(params) {

  }
}