'use strict';

const xml_to_json = require('./_xml_to_json');
const convert_to_array = require('./_convert_to_array');

module.exports = async xml => {
  let response = [];

  try {
    let opts = { ignoreAttrs: false, explicitRoot: false, explicitArray: false };
    let results = await xml_to_json(xml, opts);
    
    response = convert_to_array(results.GetCompetitivePricingForSKUResult).map(result => {
      let json = {};

      let { Product: { Identifiers, CompetitivePricing, SalesRankings } } = result;
      
      // assign SellerSKU
      json.ASIN = Identifiers.MarketplaceASIN.ASIN;
      json.SellerSKU = Identifiers.SKUIdentifier.SellerSKU;

      // parse out OwnBuyBox and BuyBoxPrice
      let buyBoxes = convert_to_array(CompetitivePricing.CompetitivePrices.CompetitivePrice);
      
      buyBoxes.forEach(bb => {
        if (bb['$'].condition === 'New') {
          let price = bb.Price.LandedPrice.Amount;
          let ownBB = bb['$'].belongsToRequester;
          json.BuyBoxPrice = (price) ? parseFloat(price) : null;
          json.OwnBuyBox = (ownBB === 'true') ? true : false;
        }
      });

      // parse out make salesRank
      let salesRanks = convert_to_array(SalesRankings.SalesRank);
      salesRanks.forEach(sr => {
        if (sr.ProductCategoryId === 'automotive_display_on_website') {
          json.SalesRank = parseInt(sr.Rank, 10);
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