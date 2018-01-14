const { expect } = require('chai');
const fs = require('fs');
const parsers = require('../../app/products/parsers/');

// helpers
let xml = fs.readFileSync('./test/helpers/GetLowestPriceOffers.xml', 'utf8');


describe('Testing the GetLowestPriceForASIN parser', () => {
  let response;

  before(async () => {
    response = await parsers.getLowestOffers(xml);
  });

  it('should have an asin identifier', () => {
    expect(response.ASIN).to.equal('B003E3OEQG');
  });


  describe('testing the summary of the response', () => {
    
    before(async() => {
      response = await parsers.getLowestOffers(xml);
    });

    it('Amazon summary should have count total 1', () => {
      expect(response.Summary.Amazon.Count.Total).to.equal(1);
    });

    it('Amazon summary should have count eligible 1', () => {
      expect(response.Summary.Amazon.Count.Eligible).to.equal(1);
    });

    it('Amazon summary should have lowest price of 61.85', () => {
      expect(response.Summary.Amazon.LandedPrice).to.equal(61.85);
    });

    it('Merchant summary should have count total 9', () => {
      expect(response.Summary.Merchant.Count.Total).to.equal(9);
    });

    it('Merchant summary should have count eligible 9', () => {
      expect(response.Summary.Merchant.Count.Eligible).to.equal(9);
    });

    it('Merchant summary should have lowest price of 57.72', () => {
      expect(response.Summary.Merchant.LandedPrice).to.equal(57.72);
    });
  });

  describe('Testing the buy box information', () => {

    it('should have buy box price of 61.85', () => {
      expect(response.BuyBox).to.equal(61.85);
    });

  });

  describe('Testing the offers portion', () => {

    it('should have 10 offers', () => {
      expect(response.Offers).to.have.length(10);
    });

    it('each offer should have seller feedback rating', () => {
      response.Offers.forEach(item => {
        expect(item.Condition).to.exist;
        expect(item.SellerPositiveFeedbackRating).to.exist;
        expect(item.FeedbackCount).to.exist;
        expect(item.ListingPrice).to.exist;
        expect(item.Shipping).to.exist;
        expect(item.ShipsFrom).to.exist;
        expect(item.FBA).to.exist;
        expect(item.BuyBoxOwner).to.exist;
        expect(item.FeaturedMerchant).to.exist;
      });
    });

  });

});