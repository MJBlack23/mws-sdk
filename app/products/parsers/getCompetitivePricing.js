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
      let comp = convertToArray(CompetitivePricing.CompetitivePrices);
      let competition = comp.map(compPrice => {
        let { CompetitivePrice } = compPrice;
        let { Price: { LandedPrice, ListingPrice, Shipping } } = CompetitivePrice;

        return {
          CompetitivePriceId: parseInt(CompetitivePrice.CompetitivePriceId),
          Condition: CompetitivePrice['$'].condition,
          Subcondition: CompetitivePrice['$'].subcondition,
          BelongsToRequestor: CompetitivePrice['$'].belongsToRequestor,
          LandedPrice,
          ListingPrice,
          Shipping
        }
      });

      let salesRanks= [];
      if (SalesRankings.SalesRank) {
        salesRanks = SalesRankings.SalesRank.map(rank => {
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