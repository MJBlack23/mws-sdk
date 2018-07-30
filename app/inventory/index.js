const MWS = require('../MWS');

class Inventory extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'GET',
      path: 'FulfillmentInventory',
      version: '2010-10-01',
      query: {},
    };
  }

  /**
   * @param {array} params.SellerSkus - Seller SKUs for items that you want information about
   * @param {DateTime} params.QueryStartDateTime - Start date for query
   * @param {string} params.ResponseGroup - Indicates wheter or not you want the ListInventorySupply operation to
   *                          return the SupplyDetail element
   * @param {string} params.MarketplaceId - Assumes default if not specified
   */
  async listInventorySupply(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'ListInventorySupply';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query.SellerId = this.sellerId;
    } else {
      request.query.SellerId = params.SellerId;
    }

    try {
      /** Check to see if either SellerSKUs or QueryDateStartTime are present
       *  If neither are present throw error. If both are present throw error
       */

      if (!params.SellerSkus && !params.QueryStartDateTime) {
        throw new Error('Either SellerSkus or QueryDateStartTime must be supplied with this action.');
      } else if (params.SellerSkus && params.QueryStartDateTime) {
        throw new Error('Both SellerSkus and QueryDateStartTime cannot be present. One or the other for this action.');
      }

      if (params.SellerSkus) {
        params.SellerSkus.forEach((sku, i) => {
          const itemCount = i + 1;
          request.query[`SellerSkus.member.${itemCount}`] = sku;
        });
      }

      if (params.QueryStartDateTime) {
        request.query.QueryStartDateTime = params.QueryStartDateTime;
      }

      if (params.ResponseGroup) {
        request.query.ResponseGroup = params.ResponseGroup;
      }

      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await Inventory.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      /** Return the parsed response */
      return { headers, body: json };
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {*} params.NextToken - The generated string returned from ListInventorySupply if more inventory is available to return
   */
  async listInventorySupplyByNextToken(params) {
    const request = { ...this.BASE_REQUEST };
    request.query.Action = 'ListInventorySupplyByNextToken';

    /** Assign Seller ID */
    if (!params.SellerId) {
      request.query.SellerId = this.sellerId;
    } else {
      request.query.SellerId = params.SellerId;
    }

    try {
      if (!params.NextToken) {
        throw new Error('params.NextToken must be supplied for this action.');
      } else {
        request.query.NextToken = params.NextToken;
      }

      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await Inventory.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      /** Return the parsed response */
      return { headers, body: json };
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Inventory;
