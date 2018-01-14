'use strict';

const xml_to_json = require('./_xml_to_json');

module.exports = async xml => {
  let json = {};

  try {
    let opts = { ignoreAttrs: false, explicitRoot: false, explicitArray: false };
    let result = await xml_to_json(xml, opts);
    json.Status = result.GetServiceStatusResult.Status;
    json.Timestamp = result.GetServiceStatusResult.Timestamp;

  } catch (e) {
    console.log(e);
  } finally {

    return json;
  }
}