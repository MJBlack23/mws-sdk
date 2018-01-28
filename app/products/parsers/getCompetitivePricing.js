'use strict';


module.exports = async json => {
  let response = {};

  try {
    let { GetCompetitivePricingForSKUResult: { $: { SellerSKU }, Product } } = json;

    let { Identifiers, CompetitivePricing, SalesRankings } = Product;
    response.SellerSKU = SellerSKU;
    response.Product = {
      Identifiers,
      CompetitivePricing,
      SalesRankings
    };

  } catch (e) {
    console.log(e);

  } finally {

    return response;
  }
}