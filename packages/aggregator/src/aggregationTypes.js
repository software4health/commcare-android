/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

export const AGGREGATION_TYPES = {
  RAW: 'RAW',
  MOST_RECENT: 'MOST_RECENT',
  MOST_RECENT_PER_ORG_GROUP: 'MOST_RECENT_PER_ORG_GROUP',
  SUM: 'SUM',
  SUM_MOST_RECENT_PER_FACILITY: 'SUM_MOST_RECENT_PER_FACILITY',
  FINAL_EACH_DAY: 'FINAL_EACH_DAY',
  FINAL_EACH_DAY_FILL_EMPTY_DAYS: 'FINAL_EACH_DAY_FILL_EMPTY_DAYS',
  FINAL_EACH_WEEK: 'FINAL_EACH_WEEK',
  FINAL_EACH_MONTH: 'FINAL_EACH_MONTH',
  FINAL_EACH_MONTH_PREFER_DAILY_PERIOD: 'FINAL_EACH_MONTH_PREFER_DAILY_PERIOD', // I.e. use 20180214 over 201802
  FINAL_EACH_MONTH_FILL_EMPTY_MONTHS: 'FINAL_EACH_MONTH_FILL_EMPTY_MONTHS',
  FINAL_EACH_YEAR: 'FINAL_EACH_YEAR',
  FINAL_EACH_YEAR_FILL_EMPTY_YEARS: 'FINAL_EACH_YEAR_FILL_EMPTY_YEARS',
  SUM_PREVIOUS_EACH_DAY: 'SUM_PREVIOUS_EACH_DAY',
  SUM_PER_ORG_GROUP: 'SUM_PER_ORG_GROUP',
  REPLACE_ORG_UNIT_WITH_ORG_GROUP: 'REPLACE_ORG_UNIT_WITH_ORG_GROUP',
};
