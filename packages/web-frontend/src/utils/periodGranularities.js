/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import moment from 'moment';

const DAY = 'day';
const SINGLE_DAY = 'one_day_at_a_time';
const WEEK = 'week';
const SINGLE_WEEK = 'one_week_at_a_time';
const MONTH = 'month';
const SINGLE_MONTH = 'one_month_at_a_time';
const YEAR = 'year';
const SINGLE_YEAR = 'one_year_at_a_time';

const START_OF_PERIOD = 'start_of';
const END_OF_PERIOD = 'end_of';

const CONFIG = {
  [DAY]: {
    chartFormat: 'Do MMMM YYYY',
    rangeFormat: 'Do MMMM YYYY',
    pickerFormat: 'D',
    momentShorthand: 'd',
    momentUnit: 'day',
    momentUnitPlural: 'days',
  },
  [WEEK]: {
    chartFormat: 'D MMM YYYY',
    rangeFormat: '[W/C] D MMM YYYY',
    pickerFormat: '[W/C] D MMM YYYY',
    momentShorthand: 'w',
    momentUnit: 'isoWeek',
    momentUnitPlural: 'isoWeeks',
  },
  [MONTH]: {
    chartFormat: 'MMM YYYY',
    rangeFormat: 'MMM YYYY',
    pickerFormat: 'MMMM',
    momentShorthand: 'M',
    momentUnit: 'month',
    momentUnitPlural: 'months',
  },
  [YEAR]: {
    chartFormat: 'YYYY',
    rangeFormat: 'YYYY',
    pickerFormat: 'YYYY',
    momentShorthand: 'Y',
    momentUnit: 'year',
    momentUnitPlural: 'years',
  },
};

export const GRANULARITIES = {
  DAY,
  SINGLE_DAY,
  WEEK,
  SINGLE_WEEK,
  MONTH,
  SINGLE_MONTH,
  YEAR,
  SINGLE_YEAR,
};

export const GRANULARITY_CONFIG = {
  [DAY]: CONFIG[DAY],
  [SINGLE_DAY]: CONFIG[DAY],
  [WEEK]: CONFIG[WEEK],
  [SINGLE_WEEK]: CONFIG[WEEK],
  [MONTH]: CONFIG[MONTH],
  [SINGLE_MONTH]: CONFIG[MONTH],
  [YEAR]: CONFIG[YEAR],
  [SINGLE_YEAR]: CONFIG[YEAR],
};

export const GRANULARITIES_WITH_ONE_DATE = [SINGLE_DAY, SINGLE_WEEK, SINGLE_MONTH, SINGLE_YEAR];

export const GRANULARITY_SHAPE = PropTypes.oneOf([
  DAY,
  SINGLE_DAY,
  WEEK,
  SINGLE_WEEK,
  MONTH,
  SINGLE_MONTH,
  YEAR,
  SINGLE_YEAR,
]);

export function roundStartEndDates(granularity, startDate = moment(), endDate = moment()) {
  const { momentUnit } = GRANULARITY_CONFIG[granularity];
  return {
    startDate: startDate.clone().startOf(momentUnit),
    endDate: endDate.clone().endOf(momentUnit),
  };
}

const getDefaultDate = (offset, unit, modifier) => {
  //We need a valid unit to proceed.
  if (!CONFIG[unit]) {
    return moment();
  }

  let defaultDate = moment();

  if (offset) {
    const { momentUnitPlural } = CONFIG[unit];
    defaultDate = defaultDate.add(offset, momentUnitPlural);
  }

  //If modifier is set (eg: 'start_of', 'end_of'),
  //switch the default date to either start or end of the year
  if (modifier) {
    const { momentUnit } = CONFIG[unit];

    switch (modifier) {
      case START_OF_PERIOD:
        defaultDate = defaultDate.startOf(momentUnit);
        break;
      case END_OF_PERIOD:
        defaultDate = defaultDate.endOf(momentUnit);
        break;
      default:
    }
  }

  return defaultDate;
};

/**
 * Get default dates for start and end period of single date period granularities,
 * meaning both start and end date will have the same date.
 * `defaultTimePeriod` can be in 2 ways:
 *
 * Short version:
 * {
 *    defaultTimePeriod: {offset: -1, unit: 'year'}
 * }
 *
 * Long version:
 * {
 *    defaultTimePeriod: {
 *        start: {unit: 'month', offset: -1},
 *        end: {unit: 'month', offset: -1}
 *    }
 * }
 * @param {*} periodGranularity
 * @param {*} defaultTimePeriod
 */
const getDefaultDatesForSingleDateGranularities = (periodGranularity, defaultTimePeriod) => {
  let startDate = moment();
  let endDate = startDate;

  if (defaultTimePeriod) {
    let singleDateConfig;

    //If defaultTimePeriod has either start or end,
    //pick either one of them because we only want a single date for both start and end period.
    //Eg: {defaultTimePeriod: {start: {unit: 'month', offset: -1}, end: {unit: 'month', offset: -1}}}
    if (defaultTimePeriod.start || defaultTimePeriod.end) {
      singleDateConfig = defaultTimePeriod.start || defaultTimePeriod.end;
    } else {
      //else, assume defaultTimePeriod is the period config. Eg: {defaultTimePeriod: {unit: 'month', offset: -1}}
      singleDateConfig = defaultTimePeriod;
    }

    //Grab all the details and get a single default date used for both start/end period.
    const { offset, unit, modifier } = singleDateConfig;
    startDate = getDefaultDate(offset, unit, modifier);
    endDate = startDate;
  }

  return roundStartEndDates(periodGranularity, startDate, endDate);
};

/**
 * Get default dates for start and end period of normal period granularities.
 * defaultTimePeriod has to have either start or end if you want to change the default start or end date.
 * Example:
 * {
 *    defaultTimePeriod: {
 *        start: {unit: year, offset: -3, modifier: 'start_of'},
 *        end: {unit: month, offset: -1, modifier: 'end_of'}
 *    }
 * }
 * @param {*} periodGranularity
 * @param {*} defaultTimePeriod
 */
const getDefaultDatesForNormalGranularities = (periodGranularity, defaultTimePeriod) => {
  if (defaultTimePeriod) {
    let startDate = moment();
    let endDate = startDate;

    if (defaultTimePeriod.start) {
      const { offset, unit, modifier } = defaultTimePeriod.start;
      startDate = getDefaultDate(offset, unit, modifier);
    }

    if (defaultTimePeriod.end) {
      const { offset, unit, modifier } = defaultTimePeriod.end;
      endDate = getDefaultDate(offset, unit, modifier);
    }

    return roundStartEndDates(periodGranularity, startDate, endDate);
  }

  return {};
};

export function getDefaultDates(state, infoViewKey) {
  const { periodGranularity, defaultTimePeriod } = state.global.viewConfigs[infoViewKey];
  const isSingleDate = GRANULARITIES_WITH_ONE_DATE.includes(periodGranularity);

  if (isSingleDate) {
    return getDefaultDatesForSingleDateGranularities(periodGranularity, defaultTimePeriod);
  }

  return getDefaultDatesForNormalGranularities(periodGranularity, defaultTimePeriod);
}
