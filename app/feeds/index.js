const MWS = require('../MWS');
const FEED_ENUMERATIONS = require('./enumerations');

class Feeds extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'POST',
      path: 'Feeds',
      version: '2009-01-01',
      query: {},
    };

    /** Bind Context */
    this.submitFeed = this.submitFeed.bind(this);
  }

  /**
   * Submits an xml or flat file content to amazon
   *
   * @param content {string} xml or flat file format
   * @param feedType {string} feed type enumeration
   */
  async submitFeed(params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'SubmitFeed';

    if (!params.content) throw new Error('content param required on params object');
    if (!params.feedType || !FEED_ENUMERATIONS.includes(params.feedType)) throw new Error('feedType enumeration param required on params object');

    try {
      // Assign the given params
      request.query.FeedType = params.feedType;

      // Calculate the MD5 value
      const ContentMD5Value = Feeds.generateMD5(params.content);
      request.query.ContentMD5Value = ContentMD5Value;

      // Append the content to the body of the request
      request.body = params.content;

      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await Feeds.XMLToJSON(body);

      return { headers, body: json, ContentMD5Value };
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Feeds;
