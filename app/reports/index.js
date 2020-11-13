const moment = require('moment');
const MWS = require('../MWS');
const REPORT_TYPE_ENUMS = require('./reportTypeEnum');
// const parsers = require('./parsers');

const REPORT_TYPE_URL = 'http://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html';

class Reports extends MWS {
  constructor(options) {
    super(options);
    this.BASE_REQUEST = {
      method: 'GET',
      path: 'Reports',
      version: '2009-01-01',
      query: {},
    };
  }

  async requestReport(params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'RequestReport';

    if (!params.reportType) {
      throw new Error('reportType is a required param for this function');
    }
    if (!REPORT_TYPE_ENUMS.includes(params.reportType)) {
      throw new Error(`${params.reportType} is not a supported report see ${REPORT_TYPE_URL} for more information.`);
    }

    // Assign the params
    const paramKeys = Object.keys(params);

    /** Take each param and capitilize the first lettter then assign it to the query object. */
    paramKeys.forEach((key) => {
      if (key === 'startDate' || key === 'endDate') {
        params[key] = moment.isMoment(params[key])
          ? params[key].toISOString()
          : moment(params[key]).toISOString();
      }
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      request.query[formattedKey] = params[key];
    });

    let response = await this.makeCall(request);
    /** Convert the XML to JSON */
    response = await Reports.XMLToJSON(response);

    return response;
  }

  async getReportRequestList(params = {}) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetReportRequestList';

    // parse out reportRequestIds
    if ('reportRequestIds' in params && (params.reportRequestIds instanceof Array)) {
      params.reportRequestIds.forEach((reportRequest, id) => {
        const num = id + 1;
        request.query[`ReportRequestIdList.Id.${num}`] = reportRequest;
      });
    }

    if ('reportTypes' in params && params.reportTypes instanceof Array) {
      params.reportTypes.forEach((reportType, id) => {
        const num = id + 1;
        request.query[`ReportTypeList.Type.${num}`] = reportType;
      });
    }

    if ('reportStatuses' in params && params.reportStatuses instanceof Array) {
      params.reportStatuses.forEach((status, id) => {
        const num = id + 1;
        request.query[`ReportProcessingStatusList.Status.${num}`] = status;
      });
    }

    if ('maxCount' in params && params.maxCount > 0 && params.maxCount <= 100) {
      request.query.MaxCount = params.maxCount;
    }

    let response = await this.makeCall(request);
    /** Convert the XML to JSON */
    response = await Reports.XMLToJSON(response);

    return response;
  }

  async getReportList(params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetReportList';

    // parse out reportRequestIds
    if ('reportRequestIds' in params && (params.reportRequestIds instanceof Array)) {
      params.reportRequestIds.forEach((reportRequest, id) => {
        const num = id + 1;
        request.query[`ReportRequestIdList.Id.${num}`] = reportRequest;
      });
    }

    if ('reportTypes' in params && params.reportTypes instanceof Array) {
      params.reportTypes.forEach((reportType, id) => {
        const num = id + 1;
        request.query[`ReportTypeList.Type.${num}`] = reportType;
      });
    }

    if ('maxCount' in params && params.maxCount > 0 && params.maxCount <= 100) {
      request.query.MaxCount = params.maxCount;
    }

    let response = await this.makeCall(request);
    /** Convert the XML to JSON */
    response = await Reports.XMLToJSON(response);

    return response;
  }

  async getReport(reportId) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'GetReport';

    if (!reportId) {
      throw new Error('reportId is a required parameter for this function');
    }

    request.query.ReportId = reportId;

    const includeHeader = true;
    const response = await this.makeCall(request, includeHeader);

    return response;
  }
  /*eslint-disable*/
  async cancelReportRequest () {
    return null; // not implemented
  }


  /**
   * 
   * @param {string} params.ReportType - The type of report being requested
   * @param {string} params.Schedule - The scheduled type for the requested report. E.g.; _15_MINUTES, _30_MINUTES_, _1_DAY_
   * @param {date} params.ScheduleDate - The date when the next report request is scheduled to be submitted (Optional)
   */
  async manageReportSchedule (params) {
    const request = Object.assign({}, this.BASE_REQUEST);
    request.query.Action = 'ManageReportSchedule';

    if (!params.ReportType || !params.Schedule) {
      throw new Error('Parameters must include the Report Type and Schedule Enumeration');
    }

    try {
      request.query.ReportType = params.ReportType;
      request.query.Schedule = params.Schedule;

      if (params.ScheduleDate) {
        request.query.ScheduleDate = params.ScheduleDate;
      }

      const { headers, body } = await this.makeCall(request, true);

      const json = await Reports.XMLToJSON(body);

      if (json.$) {
        delete json.$;
      }

      return { headers, body: json };
    } catch (error) {
      throw error;
    }
  }

  static assignParams () {
    
  }

}

module.exports = Reports;
