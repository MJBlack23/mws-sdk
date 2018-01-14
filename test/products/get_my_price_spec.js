const { expect } = require('chai');
const fs = require('fs');
const parsers = require('../../app/products/parsers/');

// helpers
let xml = fs.readFileSync('./test/helpers/GetMyPriceForSKUs_1.xml', 'utf8');

describe('Testing the getMyPrice method', () => {
  let response;

  before(async () => {
    response = await parsers.getMyPrice(xml);
  });

  it('Item 1 should have the correct SKU', () => {
    expect(response[0].SellerSKU).to.equal('CCI-457-17S');
  });

  it('Item 1 should have my price', () => {
    expect(response[0].MyPrice).to.equal(52.45);
  });

  it('Item 1 should have a fulfillment method', () => {
    expect(response[0].Fulfillment).to.equal("MERCHANT");
  });

  it('Item 2 should have the correct SKU', () => {
    expect(response[1].SellerSKU).to.equal('DSP-GM1320168---AMZ1-031516');
  });

  it('Item 2 should have my price', () => {
    expect(response[1].MyPrice).to.equal(22.15);
  });

  it('Item 2 should have a fulfillment method', () => {
    expect(response[1].Fulfillment).to.equal("MERCHANT");
  });

});