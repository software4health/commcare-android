/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { Aggregator as BaseAggregator } from '@tupaia/aggregator';
import { getDefaultPeriod, convertPeriodStringToDateRange } from '@tupaia/utils';
import { Event } from '../types';

type PeriodParams = {
  period?: string;
  startDate?: string;
  endDate?: string;
};

export class Aggregator extends BaseAggregator {
  aggregationToAggregationConfig = (aggregation: string ) => ({
    type: aggregation
  });

  async fetchAnalytics(
    dataElementCodes: string[],
    aggregationList: string[] | undefined,
    organisationUnitCodes: string,
    hierarchy: string | undefined,
    periodParams: PeriodParams,
  ) {
    const { period, startDate, endDate } = buildPeriodQueryParams(periodParams);
    const aggregations = aggregationList
      ? aggregationList.map(this.aggregationToAggregationConfig)
      : [{ type: 'RAW' }];

    return super.fetchAnalytics(
      dataElementCodes,
      {
        organisationUnitCodes: organisationUnitCodes.split(','),
        hierarchy,
        period,
        startDate,
        endDate,
        dataServices: [{ isDataRegional: true }],
      },
      { aggregations: aggregations },
    );
  }

  async fetchEvents(
    programCode: string,
    organisationUnitCodes: string,
    periodParams: PeriodParams,
    dataElementCodes?: string[],
  ): Promise<Event[]> {
    const { period, startDate, endDate } = buildPeriodQueryParams(periodParams);
    return super.fetchEvents(
      programCode,
      {
        organisationUnitCodes: organisationUnitCodes.split(','),
        dataElementCodes,
        period,
        startDate,
        endDate,
        dataServices: [{ isDataRegional: true }],
        useDeprecatedApi: false,
      },
      { aggregationType: 'RAW' },
    );
  }
}

/**
 * Returns { startDate, endDate } format if either startDate, or endDate are passed in
 * Otherwise returns { period, startDate, endDate } format
 */
const buildPeriodQueryParams = ({ period, startDate, endDate }: PeriodParams) => {
  let builtPeriod: string | undefined;
  let builtStartDate: string | undefined;
  let builtEndDate: string | undefined;
  if (startDate && endDate) {
    builtStartDate = startDate;
    builtEndDate = endDate;
  } else if (!period && !startDate && !endDate) {
    builtPeriod = getDefaultPeriod();
    [builtStartDate, builtEndDate] = convertPeriodStringToDateRange(period);
  } else if (!startDate && !endDate) {
    builtPeriod = period;
    [builtStartDate, builtEndDate] = convertPeriodStringToDateRange(period);
  } else if (startDate) {
    builtStartDate = startDate;
    [, builtEndDate] = convertPeriodStringToDateRange(period || getDefaultPeriod());
  } else if (endDate) {
    [builtStartDate] = convertPeriodStringToDateRange(period || getDefaultPeriod());
    builtEndDate = endDate;
  }

  return { period: builtPeriod, startDate: builtStartDate, endDate: builtEndDate };
};
