const _ = require('lodash');
const MWS = require('../MWS');

class InboundShipments extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      path: 'FulfillmentInboundShipment',
      version: '2010-10-01',
      query: {},
    };
  }

  /**
   * @param {string} params.SellerId - seller id on amazon marketplace
   * @param {string} params.LabelPrepPreference - prep preference for inbound shipments
   * @param {object} params.ShipFromAddress - object that contains the ship from name, address, city, state, postal code, and country code
   * @param {array} params.InboundShipmentPlanRequestItems - array of objects that contain the items sellerSKU, quantity, case quantity prep Instructions, and prep owner
   */
  async createInboundShipmentPlan(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'CreateInboundShipmentPlan';
    request.form = true;
  
    /** Set the method for the call */
    request.method = 'POST';

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
        InboundShipments.assignAddress(request, params.ShipFromAddress, '');
      }

      /** Assign the Inbound Shipment Plan Items */
      if (!params.InboundShipmentPlanRequestItems) {
        throw new Error('params.InboundShipmentPlanRequestItems must be provided.');
      } else if (typeof params.InboundShipmentPlanRequestItems !== 'object') {
        throw new Error('params.InboundShipmentPlanRequestItems must be an array');
      } else {
        InboundShipments.assignItems(request, params.InboundShipmentPlanRequestItems, 'InboundShipmentPlanRequestItems');
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
   * @param {array}  params.InboundShipmentPlanRequestItems - array of objects that contain the items' SellerSKU, QuantityShipped, QuantityInCase
   * @param {string} params.ShipmentId - the id for the shipment returned from the createInboundShipmentPlan call
   * @param {string} params.DestinationFulfillmentCenterId - the id returned from the createInboundShipmentPlan call
   * @param {string} params.ShipmentStatus - Status of the shipment.
   * @param {string} params.IntendedBoxContentsSource
   */
  async createInboundShipment(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'CreateInboundShipment';
    request.form = true;

    /** Set the method for the call */
    request.method = 'POST';

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
        throw new Error('params.InboundShipmentHeader must be an object');
      }

      _.keys(params.InboundShipmentHeader).forEach((key) => {
        if (key !== 'ShipFromAddress') {
          request.query[`InboundShipmentHeader.${key}`] = params.InboundShipmentHeader[key];
        }
      });

      /** Assign the Ship From Address */
      if (!params.InboundShipmentHeader.ShipFromAddress) {
        throw new Error('InboundShipmentHeader.ShipFromAddress must be provided.');
      } else if (typeof params.InboundShipmentHeader.ShipFromAddress !== 'object') {
        throw new Error('InboundShipmentHeader.ShipFromAddress must be an object.');
      } else {
        InboundShipments.assignAddress(request, params.InboundShipmentHeader.ShipFromAddress, 'InboundShipmentHeader');
      }

      /** Assign the Inbound Shipment Plan Items */
      if (!params.InboundShipmentItems) {
        throw new Error('params.InboundShipmentItems must be provided.');
      } else if (typeof params.InboundShipmentItems !== 'object') {
        throw new Error('params.InboundShipmentItems must be an array');
      } else {
        InboundShipments.assignItems(request, params.InboundShipmentItems, 'InboundShipmentItems');
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

  /**
   * @param {array} params.ShipmentStatusList - array of Shipment statuses. Used to select shipments matching array values
   * @param {array} params.ShipmentIdList - array of shipment Ids
   * If both ShipmentStatusList and ShipmentIdList only shipments that match both are returned.
   */
  async listInboundShipments(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'ListInboundShipments';

    /** Set the method for the call */
    request.method = 'GET';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query['SellerId'] = this.sellerId;
    } else {
      request.query['SellerId'] = params.SellerId;
    }

    /** Check the Shipment Status List type */
    if (params.ShipmentStatusList && typeof params.ShipmentStatusList !== 'object') {
      throw new Error('params.ShipmentStatusList must be an array');
    } else if (params.ShipmentStatusList) {
      let statusNumber;
      params.ShipmentStatusList.forEach((status, i) => {
        statusNumber = i + 1;
        if (typeof status === 'string') {
          request.query[`ShipmentStatusList.member.${statusNumber}`] = status;
        }
      });
    }

    /** Check the Shipment Status List type */
    if (params.ShipmentIdList && typeof params.ShipmentIdList !== 'object') {
      throw new Error('params.ShipmentIdList must be an array');
    } else if (params.ShipmentIdList) {
      let idNumber;
      params.ShipmentIdList.forEach((id, i) => {
        idNumber = i + 1;
        if (typeof id === 'string') {
          request.query[`ShipmentIdList.member.${idNumber}`] = id;
        }
      });
    }

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

  static assignItems(request, items, itemType) {
    let itemNumber;
    items.forEach((item, i) => {
      itemNumber = i + 1;
      _.keys(item).forEach((key) => {
        if (key !== 'PrepDetailsList') {
          request.query[`${itemType}.member.${itemNumber}.${key}`] = item[key];
        } else {
          request.query[`${itemType}.member.${itemNumber}.PrepDetailsList.PrepDetails.1.PrepInstruction`] = item[key].PrepInstruction;
          request.query[`${itemType}.member.${itemNumber}.PrepDetailsList.PrepDetails.1.PrepOwner`] = item[key].PrepOwner;
        }
      });
    });

    return request;
  }

  static assignAddress(request, address, type) {
    _.keys(address).forEach((key) => {
      if (typeof address[key] === 'string') {
        if (type !== '') {
          request.query[`${type}.ShipFromAddress.${key}`] = address[key];
        } else {
          request.query[`ShipFromAddress.${key}`] = address[key];
        }
      }
    });

    return request;
  }
}

module.exports = InboundShipments;
