'use strict';

const convertToArray = require('../../helpers/_convert_to_array');

module.exports = async json => {
  let response = [];

  try {
    let { GetCompetitivePricingForSKUResult } = json;
    let result = convertToArray(GetCompetitivePricingForSKUResult);
    
    response = result.map(item => {
      let { $: { SellerSKU }, Product, Error } = item
      if (Error) {
        return {
          SellerSKU,
          Error
        }
      }
      let { Identifiers, CompetitivePricing, SalesRankings } = Product;

      let competition = [];
      if (CompetitivePricing.CompetitivePrices) {
        let comp = convertToArray(CompetitivePricing.CompetitivePrices.CompetitivePrice);
        competition = comp.map(compPrice => {
          let { Price: { LandedPrice, ListingPrice, Shipping } } = compPrice;
          
          return {
            CompetitivePriceId: parseInt(compPrice.CompetitivePriceId),
            Condition: compPrice['$'].condition,
            Subcondition: compPrice['$'].subcondition,
            BelongsToRequester: compPrice['$'].belongsToRequester === 'false' ? false : true,
            LandedPrice: {
              CurrencyCode: LandedPrice.CurrencyCode,
              Amount: parseFloat(LandedPrice.Amount)
            },
            ListingPrice: {
              CurrencyCode: ListingPrice.CurrencyCode,
              Amount: parseFloat(ListingPrice.Amount)
            },
            Shipping: {
              CurrencyCode: Shipping.CurrencyCode,
              Amount: parseFloat(Shipping.Amount)
            }
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