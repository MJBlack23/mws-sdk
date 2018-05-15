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

      return { headers, body: json.SubmitFeedResult, ContentMD5Value };
    } catch (e) {
      throw e;
    }
  }

  /**
   * Returns a list of feeds that have submitted and their status
   *
   * @param {Array} params.submissionIds - an array of submissionIds
   * @param {Integer} params.maxCount - max # of results to return
   * @param {Array} params.feedTypes - an array of submission types
   * @param {Array} params.statuses - an array of submission status
   * @param {ISO Date} params.submittedFrom
   * @param {ISO Date} params.submittedTo
   *
   * @returns {Object} response object from amazon
   */
  async getFeedSubmissionList(params) {
    const request = Object.assign({}, this.BASE_REQUEST, { method: 'GET' });
    request.query.Action = 'GetFeedSubmissionList';

    try {
      // If maxCount exists add it to the query
      if (params.maxCount) {
        request.query.MaxCount = params.maxCount;
      }

      // If submittedFrom exists, add it
      if (params.submittedFrom) {
        request.query.SubmittedFrom = params.submittedFrom;
      }

      // If submittedFrom exists, add it
      if (params.submittedTo) {
        request.query.SubmittedTo = params.submittedTo;
      }

      // Validate submissionIds
      if (params.submissionIds && params.submissionIds instanceof Array) {
        params.submissionIds.forEach((submissionId, id) => {
          const num = id + 1;
          request.query[`FeedSubmissionIdList.Id.${num}`] = submissionId;
        });
      }

      // Validate Feed Types
      if (params.feedTypes && params.feedTypes instanceof Array) {
        params.feedTypes.forEach((feedType, id) => {
          const num = id + 1;
          request.query[`FeedTypeList.Type.${num}`] = feedType;
        });
      }

      // Validate Feed Status
      if (params.statuses && params.statuses instanceof Array) {
        params.statuses.forEach((status, id) => {
          const num = id + 1;
          request.query[`FeedProcessingStatus.Status.${num}`] = status;
        });
      }

      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await Feeds.XMLToJSON(body);

      return { headers, body: json.GetFeedSubmissionListResult };
    } catch (e) {
      throw e;
    }
  }

  async getFeedSubmissionListByNextToken(nextToken) {
    const request = Object.assign({}, this.BASE_REQUEST, { method: 'GET' });
    request.query.Action = 'GetFeedSubmissionListByNextToken';

    try {
      if (!nextToken) {
        throw new Error('nextToken param is required for this call');
      }

      request.query.NextToken = nextToken;

      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await Feeds.XMLToJSON(body);

      return { headers, body: json.GetFeedSubmissionListByNextTokenResult };
    } catch (e) {
      throw e;
    }
  }

  async getFeedSubmissionResult(feedSubmissionId) {
    const request = Object.assign({}, this.BASE_REQUEST, { method: 'GET' });
    request.query.Action = 'GetFeedSubmissionResult';

    try {
      if (!feedSubmissionId) {
        throw new Error('submissionId is required for this call!');
      }

      request.query.FeedSubmissionId = feedSubmissionId;

      /** Make the Call */
      const { headers, body } = await this.makeCall(request, true);

      /** Convert the XML to JSON */
      const json = await Feeds.XMLToJSON(body);

      return { headers, body: json.Message };
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Feeds;
