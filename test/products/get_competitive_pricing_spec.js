const { expect } = require('chai');
const fs = require('fs');
const parsers = require('../../app/products/parsers/');

// helpers
let xml = fs.readFileSync('./test/helpers/GetCompetitivePricingForSKU_1.xml', 'utf8');

describe('Testing the getCompetitivePricing call in the Products API', () => {
  let response;

  before(async () => {
    response = await parsers.getCompetitivePricing(xml);
  });
  
  it('Should have a SellerSKU', () => {
    expect(response[0].SellerSKU).to.equal('CCI-457-17S');
  });

  it('Should have a OwnBuyBox', () => {
    expect(response[0].OwnBuyBox).to.be.true;
  });

  it('Should have a Sales Rank', () => {
    expect(response[0].SalesRank).to.equal(20403);
  });

  it('Should have a Buy Box Price', () => {
    expect(response[0].BuyBoxPrice).to.equal(52.45);
  });

});