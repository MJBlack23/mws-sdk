'use strict';

const convertToArray = require('../../helpers/_convert_to_array');

module.exports = async json => {
  let response = [];

  try {
    let { GetCompetitivePricingForSKUResult } = json;
    let result = convertToArray(GetCompetitivePricingForSKUResult);
    
    response = result.map(item => {
      let { $: { SellerSKU }, Product } = item
      let { Identifiers, CompetitivePricing, SalesRankings } = Product;

      // TODO:  Parse out CompetitivePricing a little cleaner...
      let competition = [];
      if (CompetitivePricing.CompetitivePrices) {
        let comp = convertToArray(CompetitivePricing.CompetitivePrices.CompetitivePrice);
        competition = comp.map(compPrice => {
          let { Price: { LandedPrice, ListingPrice, Shipping } } = compPrice;

          return {
            CompetitivePriceId: parseInt(compPrice.CompetitivePriceId),
            Condition: compPrice['$'].condition,
            Subcondition: compPrice['$'].subcondition,
            BelongsToRequestor: compPrice['$'].belongsToRequestor,
            LandedPrice,
            ListingPrice,
            Shipping
          }
        });
      }


      let salesRanks= [];
      if (SalesRankings.SalesRank) {
        let salesArrays = convertToArray(SalesRankings.SalesRank);
        salesRanks = salesArrays.map(rank => {
          return {
            [rank.ProductCategoryId]: parseInt(rank.Rank, 10)
          }
        });
      }

      return {
        SellerSKU,
        Product: {
          Identifiers,
          CompetitivePricing: competition,
          SalesRankings: salesRanks
        }
      }
    });

    

  } catch (e) {
    console.log(e);

  } finally {

    return response;
  }
}