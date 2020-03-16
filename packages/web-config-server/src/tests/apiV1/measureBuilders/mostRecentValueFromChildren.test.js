/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { expect } from 'chai';
import { it, describe } from 'mocha';
import sinon from 'sinon';

import { DISTRICT_INDEX } from '/apiV1/utils/getLevelIndex';
import { mostRecentValueFromChildren } from '/apiV1/measureBuilders/mostRecentValueFromChildren';

const dataElementCode = 'POP01';
const dataServices = [{ isDataRegional: true }];
const aggregationEntityType = 'region';

const organisationUnitGroupCode = 'TO';
const organisationUnitsResults = [
  { code: 'TO_Niuas', name: 'Niuas', children: [] },
  { code: 'TO_Eua', name: "'Eua", children: [{ code: 'TO_Neikihp' }] },
  {
    code: 'TO_Haapai',
    name: "Ha'apai",
    children: [{ code: 'TO_NomukaHC' }, { code: 'TO_HfevaHC' }],
  },
];
const orgUnitToGroupKeys = {
  TO_Neikihp: 'TO_Eua',
  TO_NomukaHC: 'TO_Haapai',
  TO_HfevaHC: 'TO_Haapai',
};
const analytics = {
  results: [
    {
      dataElement: 'POP01',
      organisationUnit: 'TO_Haapai',
      period: 20190320,
      value: 5,
    },
  ],
};

const createAggregator = () => {
  const fetchAnalytics = sinon.stub();
  fetchAnalytics
    .resolves({ results: [] })
    .withArgs(
      [dataElementCode],
      { dataServices, organisationUnitCode: organisationUnitGroupCode },
      {},
      {
        aggregationType: 'MOST_RECENT_PER_ORG_GROUP',
        aggregationConfig: { orgUnitToGroupKeys: sinon.match(orgUnitToGroupKeys) },
      },
    )
    .resolves(analytics);

  return {
    aggregationTypes: { MOST_RECENT_PER_ORG_GROUP: 'MOST_RECENT_PER_ORG_GROUP' },
    fetchAnalytics,
  };
};

const createDhisApi = () => {
  const getOrganisationUnits = sinon.stub();
  getOrganisationUnits
    .returns([])
    .withArgs(
      sinon.match({
        filter: { 'ancestors.code': organisationUnitGroupCode },
        level: DISTRICT_INDEX,
      }),
    )
    .returns(organisationUnitsResults);

  return {
    getOrganisationUnits,
  };
};

describe('mostRecentValueFromChildren', () => {
  it('should return the most recent value for each org unit of the specified aggregation entity type', async () => {
    const results = await mostRecentValueFromChildren(
      createAggregator(),
      createDhisApi(),
      { dataElementCode, organisationUnitGroupCode },
      { aggregationEntityType, dataServices },
    );

    expect(results).to.deep.equal([{ POP01: 5, organisationUnitCode: 'TO_Haapai' }]);
  });
});
