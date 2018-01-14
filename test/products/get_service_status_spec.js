const { expect } = require('chai');
const fs = require('fs');
const parsers = require('../../app/products/parsers/');

// helpers
let xml = fs.readFileSync('./test/helpers/GetServiceStatus.xml', 'utf8');

describe('Testing the getServiceStatus call in the Products API', () => {

  it('Should be able to parse the XML response', async () => {
    let json = await parsers.getServiceStatus(xml);

    expect(json).to.have.property('Status');
    expect(json).to.have.property('Timestamp');
    expect(json.Status).to.equal('GREEN');
  });

});