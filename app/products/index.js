const MWS = require('../MWS');
const parsers = require('./parsers');

class Products extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'POST',
      path: 'Products',
      version: '2011-10-01',
      query: {},
    };

    /** Bind Context */
    this.getCompetitivePriceForSKUs = this.getCompetitivePriceForSKUs.bind(this);
  }


  async getServiceStatus() {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetServiceStatus';

    /** Make the Call */
    let response = await this.makeCall(request);

    /** Convert the XML to JSON */
    response = await Products.XMLToJSON(response);

    return parsers.getServiceStatus(response);
  } // end getServiceStatus


  async getCompetitivePriceForSKUs(list = []) {
    Products.validListLength(list, 'getCompetitivePriceForSKUs');

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetCompetitivePricingForSKU';
    Products.assignSKUListToQuery(request, list);

    /** Make the Call */
    let response = await this.makeCall(request);

    /** Convert the XML to JSON */
    response = await Products.XMLToJSON(response);

    return parsers.getCompetitivePricing(response);
  }


  async getMyPriceForSKUs(list = []) {
    Products.validListLength(list, 'getMyPriceForSKU');

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetMyPriceForSKU';

    Products.assignSKUListToQuery(request, list);

    const response = await this.makeCall(request);

    return parsers.getMyPrice(response);
  }


  async getLowestPriceOffersForASIN(asin) {
    try {
      if (typeof asin !== 'string' || asin.length !== 10) {
        throw Error('This call requests a single 10 digit ASIN as a parameter.');
      }
  
      const request = Object.assign({}, this.BASE_REQUEST);
      request.query.Action = 'GetLowestPricedOffersForASIN';
      request.query.ItemCondition = 'New';
      request.query.ASIN = asin;
      request.form = true;
  
      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await Products.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      /** Return the parsed response */
      return { headers, body: json };
    } catch (error) {
      throw error;
    }
  }


  async getLowestPriceOffersForSKU(sku) {
    try {
      const request = Object.assign({}, this.BASE_REQUEST);
      request.query.Action = 'GetLowestPricedOffersForSKU';
      request.query.ItemCondition = 'New';
      request.query.SellerSKU = sku;
  
      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await Products.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      /** Return the parsed response */
      return { headers, body: json };
    } catch (error) {
      throw error;
    }
  }

  async getMatchingProduct(asinList) {
    if (!asinList || !Array.isArray(asinList)) {
      throw Error('ASIN List must be an array');
    }

    if (asinList.length > 10) {
      throw Error('A maximum of 10 ASINS are allowed per call');
    }

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetMatchingProduct';
    request.query.MarketplaceId = this.marketplaceId;

    Products.assignASINListToQuery(request, asinList);

    const response = await this.makeCall(request);

    return Products.XMLToJSON(response);
  }

  async listMatchingProducts(queryString) {
    if (!queryString || typeof queryString !== 'string') {
      throw Error('query string must be supplied with this call');
    }

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'ListMatchingProducts';
    request.query.MarketplaceId = this.marketplaceId;
    request.query.Query = queryString;

    const response = await this.makeCall(request);

    return Products.XMLToJSON(response);
  }

  async getCompetitivePricingForASIN(asinList) {
    if (!asinList || !Array.isArray(asinList)) {
      throw Error('ASIN List must be an array');
    }

    if (asinList.length > 20) {
      throw Error('A maximum of 20 ASINS are allowed per call');
    }

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetCompetitivePricingForASIN';
    request.query.MarketplaceId = this.marketplaceId;

    Products.assignASINListToQuery(request, asinList);

    const response = await this.makeCall(request);

    return Products.XMLToJSON(response);
  }

  async getMyPriceForASIN(asinList) {
    if (!asinList || !Array.isArray(asinList)) {
      throw Error('ASIN List must be an array');
    }

    if (asinList.length > 20) {
      throw Error('A maximum of 20 ASINS are allowed per call');
    }

    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetMyPriceForASIN';
    request.query.MarketplaceId = this.marketplaceId;

    Products.assignASINListToQuery(request, asinList);

    const response = await this.makeCall(request);

    return Products.XMLToJSON(response);
  }


  static validListLength(list, call) {
    if (list.length <= 0 || list.length > 20) {
      throw Error(`${call} requires an array of between 1 and 20 SKUs.`);
    }
    return true;
  }

  static assignSKUListToQuery(request, list) {
    list.forEach((item, i) => {
      request.query[`SellerSKUList.SellerSKU.${i + 1}`] = item;
    });

    return request;
  }

  static assignASINListToQuery(request, list) {
    list.forEach((item, i) => {
      request.query[`ASINList.ASIN.${i + 1}`] = item;
    });

    return request;
  }
}

module.exports = Products;
