/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import groupBy from 'lodash.groupby';
import { RespondingError, dateStringToPeriod } from '@tupaia/utils';
import { generateId } from '@tupaia/database';
import { Route } from '../Route';
import { validateIsNumber } from '../../utils';
import {
  MIN_DATE,
  SYNDROME_CODES,
  CONFIRMED_WEEKLY_SURVEY_COUNTRY,
  ALERT_SURVEY,
} from '../../constants';

const WEEKLY_REPORT_CODE = 'PSSS_Weekly_Cases';
const ACTIVE_ALERTS_REPORT_CODE = 'PSSS_Active_Alerts';
const CONFIRMED_WEEKLY_REPORT_CODE = 'PSSS_Confirmed_Weekly_Report';

type ConfirmedWeeklyReportAnswers = {
  PSSS_Confirmed_Sites: number;
  PSSS_Confirmed_Sites_Reported: number;
  PSSS_Confirmed_AFR_Cases: number;
  PSSS_Confirmed_DIA_Cases: number;
  PSSS_Confirmed_ILI_Cases: number;
  PSSS_Confirmed_PF_Cases: number;
  PSSS_Confirmed_DLI_Cases: number;
};

export class ConfirmCountryWeeklyReportRoute extends Route {
  async buildResponse() {
    const { week } = this.req.query;
    const { countryCode } = this.req.params;
    const confirmedData = await this.confirmData(countryCode, week);
    const alertData = await this.createAlerts(countryCode, week);

    return { confirmedData, alertData };
  }

  async confirmData(countryCode: string, week: string) {
    const report = await this.reportConnection?.fetchReport(
      WEEKLY_REPORT_CODE,
      [countryCode],
      [week],
    );

    if (!report || report.results.length === 0) {
      throw new RespondingError(
        `Cannot confirm weekly data: no weekly data found for ${countryCode} - ${week}`,
        500,
      );
    }

    const answers = mapUnconfirmedReportToConfirmedAnswers(report.results[0]);

    return this.meditrakConnection?.updateOrCreateSurveyResponse(
      CONFIRMED_WEEKLY_SURVEY_COUNTRY,
      countryCode,
      week,
      answers,
    );
  }

  async createAlerts(countryCode: string, week: string) {
    const report = await this.reportConnection?.fetchReport(
      CONFIRMED_WEEKLY_REPORT_CODE,
      [countryCode],
      [week],
    );

    if (!report || report.results.length === 0) {
      throw new RespondingError(
        `Cannot create alerts: no confirmed weekly data found for ${countryCode} - ${week}`,
        500,
      );
    }

    const [result] = report.results;
    const response: any = {
      createdAlerts: [],
    };
    const startWeek = dateStringToPeriod(MIN_DATE, 'WEEK');
    const activeAlertsData = await this.reportConnection?.fetchReport(
      ACTIVE_ALERTS_REPORT_CODE,
      [countryCode],
      [startWeek, week],
    );

    if (!activeAlertsData) {
      // should not be undefined even if there is no data
      throw new RespondingError(
        `Cannot create alerts: no active alerts data found for ${countryCode} - ${week}`,
        500,
      );
    }

    const { results: alerts } = activeAlertsData;
    const alertsBySyndrome = groupBy(alerts, 'syndrome');

    for (const syndromeCode of SYNDROME_CODES) {
      const syndromeAlerts = alertsBySyndrome[syndromeCode];

      // If there is no existing active alert for this syndrome,
      // and the threshold is crossed for this syndrome, create a new one
      if (!syndromeAlerts && result[`${syndromeCode} Threshold Crossed`] === true) {
        const surveyResponseId = generateId();
        await this.meditrakConnection?.createSurveyResponse(
          ALERT_SURVEY,
          countryCode,
          week,
          {
            PSSS_Alert_Syndrome: syndromeCode,
            PSSS_Alert_Archived: 'No',
          },
          surveyResponseId,
        );

        response.createdAlerts.push({
          id: surveyResponseId,
          title: syndromeCode,
        });

        continue;
      }

      const currentWeekSyndromeAlert =
        syndromeAlerts && syndromeAlerts.find(a => a.period === week);

      // If there is an existing alert triggered in the selected week,
      // and now for the selected week, the threshold is no longer crossed (because of reconfirming changed data),
      // archive the existing alert triggered in the selected week
      if (currentWeekSyndromeAlert && result[`${syndromeCode} Threshold Crossed`] === false) {
        const alertSurveyResponse = await this.meditrakConnection?.findSurveyResponseById(
          currentWeekSyndromeAlert.id,
        );
        await this.meditrakConnection?.updateSurveyResponse(alertSurveyResponse, {
          PSSS_Alert_Syndrome: syndromeCode,
          PSSS_Alert_Archived: 'Yes',
        });
      }
    }

    return response;
  }
}

const mapUnconfirmedReportToConfirmedAnswers = (
  reportValues: Record<string, unknown>,
): ConfirmedWeeklyReportAnswers => {
  const {
    Sites: sites,
    'Sites Reported': sitesReported,
    AFR: afr,
    DIA: dia,
    ILI: ili,
    PF: pf,
    DLI: dli,
  } = reportValues;

  const errorHandler = (field: string) => (value: unknown) =>
    new RespondingError(
      `Cannot confirm weekly data: Invalid value for '${field}' - ${value} is not a number`,
      500,
    );

  return {
    PSSS_Confirmed_Sites: validateIsNumber(sites, errorHandler('Sites')),
    PSSS_Confirmed_Sites_Reported: validateIsNumber(sitesReported, errorHandler('Sites Reported')),
    PSSS_Confirmed_AFR_Cases: validateIsNumber(afr, errorHandler('AFR')),
    PSSS_Confirmed_DIA_Cases: validateIsNumber(dia, errorHandler('DIA')),
    PSSS_Confirmed_ILI_Cases: validateIsNumber(ili, errorHandler('ILI')),
    PSSS_Confirmed_PF_Cases: validateIsNumber(pf, errorHandler('PF')),
    PSSS_Confirmed_DLI_Cases: validateIsNumber(dli, errorHandler('DLI')),
  };
};
