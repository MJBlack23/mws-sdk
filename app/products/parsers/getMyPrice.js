'use strict';

const xml_to_json = require('./_xml_to_json');
const convert_to_array = require('./_convert_to_array');

module.exports = async xml => {
  let response = [];

  try {
    let opts = { ignoreAttrs: false, explicitRoot: false, explicitArray: false };
    let results = await xml_to_json(xml, opts);

    response = convert_to_array(results.GetMyPriceForSKUResult).map(result => {
      let json = {};

      let { Product: { Identifiers, Offers } } = result;
      
      // assign the seller SKU
      json.SellerSKU = Identifiers.SKUIdentifier.SellerSKU;

      convert_to_array(Offers.Offer).forEach(offer => {
        if (offer.ItemCondition === 'New') {
          let price = offer.BuyingPrice.LandedPrice.Amount;
          let fulfillment = offer.FulfillmentChannel;
          json.MyPrice = (price) ? parseFloat(price) : null;
          json.Fulfillment = (fulfillment) ? fulfillment : null;
        }
      });

      return json;
    });

  } catch (e) {
    console.log(e);

  } finally {
    return response;
  }
}