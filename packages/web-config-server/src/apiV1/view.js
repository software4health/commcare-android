import { Aggregator } from '@tupaia/aggregator';
import { convertDateRangeToPeriods } from '@tupaia/dhis-api';
import { DashboardReport } from '/models';
import { getDhisApiInstance } from '/dhis';
import { CustomError } from '@tupaia/utils';
import { DhisTranslationHandler, isSingleValue } from './utils';
import { getDataBuilder } from '/apiV1/dataBuilders/getDataBuilder';

const viewFail = {
  type: 'View Error',
  responseStatus: 400,
};

const noViewWithId = {
  responseText: {
    status: 'viewError',
    details: 'No view with corresponding id',
  },
};

const noDataBuilder = {
  responseText: {
    status: 'viewError',
    details: 'No data builder defined for current view',
  },
};

const convertDateRangeToPeriodQueryString = (startDate, endDate) => {
  if (!startDate) {
    return null;
  }

  if (startDate && !endDate) {
    return convertDateRangeToPeriods(startDate, startDate)[0];
  }

  return convertDateRangeToPeriods(startDate, endDate).join(';');
};

const getIsValidDate = dateString => !Number.isNaN(Date.parse(dateString));

/* View implementation now delegates data builder to corresponding view data builder
 */
export default class extends DhisTranslationHandler {
  buildData = async req => {
    const { startDate, endDate, ...restOfQuery } = req.query;
    if (getIsValidDate(startDate)) this.startDate = startDate;
    if (getIsValidDate(endDate)) this.endDate = endDate;

    const { viewId, drillDownLevel } = req.query;
    // If drillDownLevel is undefined, send it through as null instead so it's not dropped from the object.
    const dashboardReport = await DashboardReport.findOne({
      id: viewId,
      drillDownLevel: drillDownLevel || null,
    });
    if (!dashboardReport) {
      throw new CustomError(viewFail, noViewWithId, { viewId });
    }

    this.query = {
      ...restOfQuery,
      period: convertDateRangeToPeriodQueryString(this.startDate, this.endDate),
      startDate: this.startDate,
      endDate: this.endDate,
    };

    const { viewJson, dataBuilderConfig, dataBuilder, dataServices } = dashboardReport;
    this.viewJson = this.translateViewJson(viewJson);
    this.dataBuilderConfig = dataBuilderConfig;
    this.dataServices = dataServices;

    const dataBuilderData = await this.buildDataBuilderData(dataBuilder, req);
    return this.addViewMetaData(dataBuilderData);
  };

  async buildDataBuilderData(dataBuilderName, req) {
    const dataBuilder = this.getDataBuilder(dataBuilderName);
    if (!dataBuilder) {
      throw new CustomError(viewFail, noDataBuilder, { dataBuilder });
    }

    const aggregator = new Aggregator();
    const dhisApiInstances = this.dataServices.map(({ isDataRegional }) =>
      getDhisApiInstance(this.entity.code, isDataRegional),
    );

    return dataBuilder({ ...this, req }, aggregator, ...dhisApiInstances);
  }

  translateViewJson(viewJson) {
    // if a dashboard is expanded, we remove any placeholder it may normally display
    return this.query.isExpanded === 'true' ? { ...viewJson, placeholder: undefined } : viewJson;
  }

  getDataBuilder(dataBuilderName) {
    // if there is a placeholder to display, don't build any data
    return getDataBuilder(this.viewJson.placeholder ? 'blankDataBuilder' : dataBuilderName);
  }

  // common view translation (for all possible views)
  addViewMetaData = inJson => {
    const { viewJson, query, startDate, endDate } = this;
    const { drillDown } = viewJson;
    let returnJson = {
      viewId: query.viewId,
      drillDownLevel: drillDown && !query.drillDownLevel ? 0 : query.drillDownLevel,
      organisationUnitCode: query.organisationUnitCode,
      dashboardGroupId: query.dashboardGroupId,
      startDate,
      endDate,
      ...viewJson,
    };
    // Some of the data builders are used for single and multi data values, multi data values
    // get stored as a row in data field, where as single data values info should be joined to
    // straight to the root json. Some single values are a set of value,
    // i.e. for fraction it's 'value' and 'total' thus ...inJson.data[0].
    if (
      isSingleValue(viewJson) &&
      typeof inJson.data === 'object' &&
      typeof inJson.data[0] === 'object'
    ) {
      returnJson = { ...inJson.data[0], data: undefined, ...returnJson };
    }

    return { ...inJson, ...returnJson };
  };
}
