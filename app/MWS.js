'use strict';

const assert = require('assert');
const request = require('request-promise-native');
const crypto = require('crypto');
const qs = require('querystring');
const _ = require('lodash');

class MWS {
  constructor(config={}) {
    if (!config.marketplaceId) throw Error('If using a configuration object, you must include marketplaceId');
    if (!config.sellerId) throw Error('If using a configuration object, you must include sellerId');
    if (!config.authToken) throw Error('If using a configuration object, you must include authToken');
    if (!config.accessKeyId) throw Error('If using a configuration object, you must include accessKeyId');
    if (!config.secretKey) throw Error('If using a configuration object, you must include secretKey');

    this.host = config.mwsHost || 'mws.amazonservices.com';
    this.sellerId = config.sellerId;
    this.authToken = config.authToken;
    this.accessKeyId = config.accessKeyId;
    this.secretKey = config.secretKey;
    this.marketplaceId = config.marketplaceId;

    MWS.__format_query = MWS.__format_query.bind(this);
  }

  async makeCall(params) {

    // append the query to the call object
    const call = {
      url: `https://${this.host}:443/${params.path}/${params.version}`,
      method: params.method,
      headers: {
        Host: this.host,
        'User-Agent': 'OMS/1.0 (language=Javascript)',
        'Content-Type': 'text/xml'
      },
      responseFormat: 'json',
      qs: null
    };

    const query = MWS.__format_query(params);

    // create the string to sign
    const stringToSign = [
      params.method, 
      this.host, 
      `/${params.path}/${params.version}`, 
      qs.stringify(query)
    ].join('\n');

    query.Signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(stringToSign)
      .digest('base64');

    call.qs = query;

    // console.log(call);
    // process.exit();

    return await request(call);
  }


  static __format_query(params) {
    const BASE_QUERY = {
      SignatureVersion: 2,
      Timestamp: new Date().toISOString(),
      Version: params.version,
      SignatureMethod: 'HmacSHA256',
      AWSAccessKeyId: this.accessKeyId,
      SellerId: this.sellerId,
      MWSAuthToken: this.authToken,
      MarketplaceId: this.marketplaceId
    };

    // append any params from the query
    _.keys(params.query).forEach(key => {
      BASE_QUERY[key] = params.query[key];
    });

    // sort the base Query
    const keys = _.keys(BASE_QUERY);
    const sortedQuery = {};
    keys.sort();
    keys.forEach(key => {
      sortedQuery[key] = BASE_QUERY[key];
    });

    return sortedQuery;
  }

  static __parse_env() {
    const { MWS_HOST, MWS_MARKETPLACE_ID, MWS_SELLER_ID, MWS_AUTH_TOKEN, MWS_ACCESS_KEY, MWS_SECRET_KEY } = process.env;

    if (!MWS_MARKETPLACE_ID) throw Error('If using environment variables, you must include MWS_MARKETPLACE_ID');
    if (!MWS_SELLER_ID) throw Error('If using environment variables, you must include MWS_SELLER_ID');
    if (!MWS_AUTH_TOKEN) throw Error('If using environment variables, you must include MWS_AUTH_TOKEN');
    if (!MWS_ACCESS_KEY) throw Error('If using environment variables, you must include MWS_ACCESS_KEY');
    if (!MWS_SECRET_KEY) throw Error('If using environment variables, you must include MWS_SECRET_KEY');
    
    this.host = (MWS_HOST) ? MWS_HOST : 'mws.amazonservices.com';
    this.sellerId = MWS_SELLER_ID;
    this.authToken = MWS_AUTH_TOKEN;
    this.accessKeyId = MWS_ACCESS_KEY;
    this.secretKey = MWS_SECRET_KEY;
    this.marketplaceId = MWS_MARKETPLACE_ID;

    return true;
  }
}; // end MWS Class

module.exports = MWS;