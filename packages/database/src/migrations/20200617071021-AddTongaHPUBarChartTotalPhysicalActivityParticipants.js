'use strict';

import { insertObject, arrayToDbString } from '../utilities';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const DATA_BUILDER_CONFG = {
  series: {
    Male: {
      '< 10 years': [
        'HP8',
        'HP18'
      ],
      '10 - 19 years': [
        'HP10',
        'HP20',
      ],
      '20 - 39 years': [
        'HP12',
        'HP22'
      ],
      '40 - 59 years': [
        'HP14',
        'HP24'
      ],
      '60 + years': [
        'HP16',
        'HP26'
      ]
    },
    Female: {
      '< 10 years': [
        'HP9',
        'HP19'
      ],
      '10 - 19 years': [
        'HP11',
        'HP21',
      ],
      '20 - 39 years': [
        'HP13',
        'HP23'
      ],
      '40 - 59 years': [
        'HP15',
        'HP25'
      ],
      '60 + years': [
        'HP17',
        'HP27'
      ]
    }
  },
  programCode: 'HP01'
}

const VIEW_JSON_CONFIG = {
  name: 'Total physical activity participants by age and gender',
  type: 'chart',
  chartType: 'bar',
  periodGranularity: 'one_year_at_a_time',
  chartConfig: {
    Male: { stackId: 1 },
    Female: { stackId: 2 }
  },
  defaultTimePeriod: {
    unit: 'year',
    offset: -1
  },
};

const DASHBOARD_GROUPS = ['TO_Health_Promotion_Unit_Country'];

const REPORT_ID = 'TO_HPU_Total_Physical_Activity_Participants';

const DATA_SERVICES = [{ isDataRegional: false }];

const REPORT = {
  id: REPORT_ID,
  dataBuilder: 'sumAllPerSeries',
  dataBuilderConfig: DATA_BUILDER_CONFG,
  viewJson: VIEW_JSON_CONFIG,
  dataServices: DATA_SERVICES
}

exports.up = async function (db) {
  await insertObject(db, 'dashboardReport', REPORT);

  await db.runSql(`
    UPDATE "dashboardGroup"
    SET "dashboardReports" = "dashboardReports" || '{${REPORT_ID}}'
    WHERE code IN (${arrayToDbString(DASHBOARD_GROUPS)});
  `);
};

exports.down = async function (db) {
  await db.runSql(`
    DELETE FROM "dashboardReport" WHERE id = '${REPORT_ID}';

    UPDATE "dashboardGroup"
    SET "dashboardReports" = array_remove("dashboardReports", '${REPORT_ID}')
    WHERE code IN (${arrayToDbString(DASHBOARD_GROUPS)});
  `);
};

exports._meta = {
  'version': 1
};
