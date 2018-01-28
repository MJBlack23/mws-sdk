'use strict';

const MWS = require('../MWS');
const parsers = require('./parsers');

class Products extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'GET',
      path: 'Products',
      version: '2011-10-01',
      query: {}
    };
  }


  async getServiceStatus () {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetServiceStatus';

    /** Make the Call */
    let response = await this.makeCall(request);

    /** Convert the XML to JSON */
    response = await Products.__xml_to_json(response);

    return parsers.getServiceStatus(response);
  } // end getServiceStatus


  async getCompetitivePriceForSKUs(list=[]) {
    Products.validListLength(list, 'getCompetitivePriceForSKUs');

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetCompetitivePricingForSKU';
    Products.assignSKUListToQuery(request, list);

    /** Make the Call */
    let response = await this.makeCall(request);

    /** Convert the XML to JSON */
    response = await Products.__xml_to_json(response);
    
    return parsers.getCompetitivePricing(response);
  }


  async getMyPriceForSKUs(list=[]) {
    Products.validListLength(list, 'getMyPriceForSKU');

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetMyPriceForSKU';

    Products.assignSKUListToQuery(request, list);

    let response = await this.makeCall(request);
    
    return parsers.getMyPrice(response);
  }


  async getLowestPriceOffersForASIN(asin) {
    if (typeof asin !== 'string' || asin.length !== 10)
      throw Error(`This call requests a single 10 digit ASIN as a parameter.`);

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetLowestPricedOffersForASIN';
    request.query.ItemCondition = 'New';
    request.query.ASIN = asin;

    let response = await this.makeCall(request);

    return response;
  }


  async getLowestPriceOffersForSKU(sku) {

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetLowestPricedOffersForSKU';
    request.query.ItemCondition = 'New';
    request.query.SellerSKU = sku;

    let response = await this.makeCall(request);

    return parsers.getLowestOffers(response);
    // return response;
  }


  static validListLength (list, call) {
    if (list.length <= 0 || list.length > 20) {
      throw Error(`${call} requires an array of between 1 and 20 SKUs.`);
    }
    return true;
  }

  static assignSKUListToQuery (request, list) {
    list.forEach((item, i) => {
      request.query[`SellerSKUList.SellerSKU.${i + 1}`] = item;
    });

    return request;
  }

      
}

module.exports = Products;