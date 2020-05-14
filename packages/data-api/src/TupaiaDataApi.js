/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import groupBy from 'lodash.groupby';
import moment from 'moment';

import { fetchEventData, fetchAnalyticData } from './fetchData';
import { parameteriseArray } from './utils';

const EVENT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const DAY_PERIOD_FORMAT = 'YYYYMMDD';

export class TupaiaDataApi {
  constructor(database) {
    this.database = database;
  }

  async getEvents(options) {
    const results = await fetchEventData(this.database, options);
    const resultsBySurveyResponse = groupBy(results, 'surveyResponseId');
    return Object.values(resultsBySurveyResponse).map(resultsForSurveyResponse => {
      const { surveyResponseId, date, entityCode, entityName } = resultsForSurveyResponse[0];
      const dataValues = resultsForSurveyResponse.reduce(
        (values, { dataElementCode, value }) => ({ ...values, [dataElementCode]: value }),
        {},
      );
      return {
        event: surveyResponseId,
        eventDate: moment(date).format(EVENT_DATE_FORMAT),
        orgUnit: entityCode, // TODO incorrect for STRIVE cases
        orgUnitName: entityName,
        dataValues,
      };
    });
  }

  async getAnalytics(options) {
    const results = await fetchAnalyticData(this.database, options);
    return results.map(({ entityCode, dataElementCode, date, value }) => ({
      organisationUnit: entityCode,
      dataElement: dataElementCode,
      period: moment(date).format(DAY_PERIOD_FORMAT),
      value,
    }));
  }

  async fetchDataElements(dataElementCodes) {
    return this.database.executeSql(
      `
      SELECT code, text as name
      FROM question
      WHERE code IN ${parameteriseArray(dataElementCodes)};
    `,
      dataElementCodes,
    );
  }
}
