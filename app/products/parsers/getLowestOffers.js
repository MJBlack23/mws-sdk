'use strict';

const xml_to_json = require('./_xml_to_json');
const convert_to_array = require('./_convert_to_array');

module.exports = async xml => {
  let response = {};

  try {
    let opts = { ignoreAttrs: false, explicitRoot: false, explicitArray: false };
    let results = await xml_to_json(xml, opts);

    let rootElement = xml.indexOf('GetLowestPricedOffersForASINResult') >= 0 ? 'GetLowestPricedOffersForASINResult' : 'GetLowestPricedOffersForSKUResult';

    let { Identifier, Summary, Offers } = results[rootElement];

    let offerCount = convert_to_array(Summary.NumberOfOffers.OfferCount);
    let lowestPrice = convert_to_array(Summary.LowestPrices.LowestPrice);
    let buyBoxPrices = convert_to_array(Summary.BuyBoxPrices.BuyBoxPrice);
    let eligibleCount = convert_to_array(Summary.BuyBoxEligibleOffers.OfferCount);
    let offers = convert_to_array(Offers.Offer);

    response.ASIN = Identifier.ASIN;
    response.SellerSKU = Identifier.SellerSKU;
    response.Summary = {};
    response.Offers = [];

    offerCount.forEach(offer => {
      response.Summary[offer['$'].fulfillmentChannel] = {
        Count: {
          Total: parseInt(offer['_'], 10),
          Eligible: null
        }
      }
    });

    lowestPrice.forEach(price => {
      response.Summary[price['$'].fulfillmentChannel].LandedPrice = parseFloat(price.LandedPrice.Amount);
    });

    buyBoxPrices.forEach(price => {
      if (price['$'].condition === 'New') {
        response.BuyBox = {
          Price: parseFloat(price.LandedPrice.Amount),
          Fulfillment: response.Summary.Merchant.LandedPrice === parseFloat(price.LandedPrice.Amount) ? 'Merchant' : 'Amazon'
        }
      }
    });

    eligibleCount.forEach(offer => {
      response.Summary[offer['$'].fulfillmentChannel].Count.Eligible = parseInt(offer['_'], 10);
    });

    offers.forEach(offer => {
      if (offer.MyOffer === 'true') {
        response.MyOffer = {
          Price: parseFloat(offer.ListingPrice.Amount),
          Fulfillment: offer.IsFulfilledByAmazon === 'false' ? 'Merchant' : 'Amazon',
          BuyBoxOwner: offer.IsBuyBoxWinner === 'false' ? false : true,
          LowestPrice: response.Summary[offer.IsFulfilledByAmazon === 'false' ? 'Merchant' : 'Amazon'].LandedPrice 
            === parseFloat(offer.ListingPrice.Amount)
        }
      }

      response.Offers.push({
        MyOffer: (offer.MyOffer === 'false' || !offer.MyOffer) ? false : true,
        Condition: offer.SubCondition,
        SellerPositiveFeedbackRating: offer.SellerFeedbackRating.SellerPositiveFeedbackRating,
        FeedbackCount: offer.SellerFeedbackRating.FeedbackCount,
        ListingPrice: parseFloat(offer.ListingPrice.Amount),
        Shipping: parseFloat(offer.Shipping.Amount),
        ShipsFrom: (offer.ShipsFrom) ? `${offer.ShipsFrom.State}, ${offer.ShipsFrom.Country}` : 'Amazon',
        FBA: offer.IsFulfilledByAmazon === 'false' ? false : true,
        BuyBoxOwner: offer.IsBuyBoxWinner === 'false' ? false : true,
        FeaturedMerchant: offer.IsFeaturedMerchant === 'false' ? false : true
      });
    });
    
  } catch (e) {
    console.log(e);
  } finally {
    return response;
  }
}