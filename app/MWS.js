'use strict';

const { promisify } = require('util');
const crypto = require('crypto');
const request = require('request-promise-native');
const qs = require('querystring');
const _ = require('lodash');

/** Promisify callbacks */
const parseString = promisify(require('xml2js').parseString);

/** Base level representation of an Amazon Merchant Web Service Call */
class MWS {
  /**
   * 
   * @param {object} config - object containing the following
   * @example marketplaceId - default used when not specifically needed by a call
   * @example sellerId - seller id for your store
   * @example authToken - MWS authentication token
   * @example accessKeyId - MWS access key
   * @example secretKey - MWS secret key
   */
  constructor(config=undefined) { 
    /** Bind Context */
    this.makeCall = this.makeCall.bind(this);

    MWS.__format_query = MWS.__format_query.bind(this);
    MWS.__parse_env = MWS.__parse_env.bind(this);
    MWS.__parse_config = MWS.__parse_config.bind(this);
    MWS.__xml_to_json = MWS.__xml_to_json.bind(this);

    if (!config) {
      MWS.__parse_env()
    } else {
      MWS.__parse_config(config);
    }

    this.xml_options = { ignoreAttrs: false, explicitRoot: false, explicitArray: false };
  }


  /**
   * Formats params from a specific call into the basic format
   * all calls use
   * @param {object} params - json object of parameters passed from 
   * down the inheritance chain on a specific call
   */
  async makeCall(params) {

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

    /** Create the string to sign */
    const stringToSign = [
      params.method, 
      this.host, 
      `/${params.path}/${params.version}`, 
      qs.stringify(query)
    ].join('\n');

    /** Sign the query */
    query.Signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(stringToSign)
      .digest('base64');

    call.qs = query;

    try {
      return await request(call);
    } catch (e) {
      if (e.statusCode === 503) {
        throw new Error('Warning!  Request Throttled');
      }
    }
  }


  /**
   * Formats a query, converts to array, then sorts and returns the array
   * @param {object} params - parameters from a call on a specific API
   */
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

    /** Append parameters to the query */
    _.keys(params.query).forEach(key => {
      if (key.indexOf('MarketplaceId') >= 0) 
        delete BASE_QUERY.MarketplaceId;

      if (params.query[key] !== null)
        BASE_QUERY[key] = params.query[key];
    });

    /** Sort the query */
    const keys = _.keys(BASE_QUERY);
    const sortedQuery = {};
    keys.sort();
    keys.forEach(key => {
      sortedQuery[key] = BASE_QUERY[key];
    });

    return sortedQuery;
  }


  /**
   * Allows the user to provide ENV variables instead of a configuration object
   * Requires access to the following Environment variables
   * @example MWS_HOST (not required, defaults to mws.amazonservices.com)
   * @example MWS_MARKETPLACE_ID 
   * @example MWS_SELLER_ID
   * @example MWS_AUTH_TOKEN
   * @example MWS_ACCESS_KEY
   * @example MWS_SECRET_KEY
   */
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

  
  static __parse_config(config) {
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

    return true;
  }


  static async __xml_to_json(xml, opts=null) {
    opts = opts ? opts : this.xml_options;
    return await parseString(xml, opts)
  }
}; // end MWS Class

module.exports = MWS;