/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { expect } from 'chai';
import { getQueryOptionsForColumns } from '../../apiV2/GETHandler/helpers';

describe('Request record types with standard joins', () => {
  it('returns one join', () => {
    const customJoinConditions = {};
    const results = getQueryOptionsForColumns(
      ['survey_response.id', 'survey.name'],
      'survey_response',
      customJoinConditions,
      null,
    );
    expect(results.sort).to.have.ordered.members(['survey_response.id', 'survey.id']);
    expect(results.multiJoin).to.deep.equal([
      {
        joinWith: 'survey',
        joinCondition: ['survey.id', 'survey_response.survey_id'],
        joinType: null,
      },
    ]);
  });
  it('Returns two joins of tables that can join to the base record type', () => {
    const customJoinConditions = {};
    const results = getQueryOptionsForColumns(
      ['survey_response.id', 'survey.name', 'user_account.first_name'],
      'survey_response',
      customJoinConditions,
      null,
    );
    expect(results.sort).to.have.ordered.members([
      'survey_response.id',
      'survey.id',
      'user_account.id',
    ]);
    expect(results.multiJoin).to.deep.equal([
      {
        joinWith: 'survey',
        joinCondition: ['survey.id', 'survey_response.survey_id'],
        joinType: null,
      },
      {
        joinWith: 'user_account',
        joinCondition: ['user_account.id', 'survey_response.user_id'],
        joinType: null,
      },
    ]);
  });
});

describe('Requests record types that require a through join', () => {
  it('returns a record type that has one through join', () => {
    const customJoinConditions = {
      country: {
        through: 'entity',
        nearTableKey: 'entity.country_code',
        farTableKey: 'country.code',
      },
    };
    const results = getQueryOptionsForColumns(
      ['survey_response.id', 'country.name'],
      'survey_response',
      customJoinConditions,
      null,
    );
    expect(results.sort).to.have.ordered.members(['survey_response.id', 'entity.id', 'country.id']);
    expect(results.multiJoin).to.deep.equal([
      {
        joinWith: 'entity',
        joinCondition: ['entity.id', 'survey_response.entity_id'],
        joinType: null,
      },
      {
        joinWith: 'country',
        joinCondition: ['country.code', 'entity.country_code'],
        joinType: null,
      },
    ]);
  });
  it('returns record types that require two through joins', () => {
    const customJoinConditions = {
      country: {
        through: 'entity',
        nearTableKey: 'entity.country_code',
        farTableKey: 'country.code',
      },
      disaster: {
        through: 'country',
        nearTableKey: 'country.code',
        farTableKey: 'disaster.countryCode',
      },
    };
    const results = getQueryOptionsForColumns(
      ['survey_response.id', 'country.name', 'disaster.type'],
      'survey_response',
      customJoinConditions,
      null,
    );
    expect(results.sort).to.have.ordered.members([
      'survey_response.id',
      'entity.id',
      'country.id',
      'disaster.id',
    ]);
    expect(results.multiJoin).to.deep.equal([
      {
        joinWith: 'entity',
        joinCondition: ['entity.id', 'survey_response.entity_id'],
        joinType: null,
      },
      {
        joinWith: 'country',
        joinCondition: ['country.code', 'entity.country_code'],
        joinType: null,
      },
      {
        joinWith: 'disaster',
        joinCondition: ['disaster.countryCode', 'country.code'],
        joinType: null,
      },
    ]);
  });
});

describe('Calling incorrect parameters to throw an error', () => {
  it('defines a column with "_" in front of it to trigger the validation error', () => {
    const err =
      'Error: No columns start with "_", and conjunction operators are reserved for internal use only';
    const customJoinConditions = {};
    expect(() =>
      getQueryOptionsForColumns(
        ['_survey_response.id', 'survey.name'],
        'survey_response',
        customJoinConditions,
        null,
      ).toThrow(err),
    );
  });

  it('defines the keys in customJoinConditions the wrong way around to trigger an error', () => {
    const err = 'nearTableKey must refer to a column on the table you wish to join through';
    const customJoinConditions = {
      country: {
        through: 'entity',
        nearTableKey: 'country.code',
        farTableKey: 'entity.country_code',
      },
    };
    expect(() =>
      getQueryOptionsForColumns(
        ['survey_response.id', 'country.name'],
        'survey_response',
        customJoinConditions,
        null,
      ).toThrow(err),
    );
  });

  it('defines customJoinConditions in the retired format to trigger an error', () => {
    const err = 'Incorrect format for customJoinConditions: entity';
    const customJoinConditions = {
      entity: ['entity.id', 'project.entity_id'],
    };
    expect(() =>
      getQueryOptionsForColumns(
        ['project.id', 'entity.id'],
        'project',
        customJoinConditions,
        null,
      ).toThrow(err),
    );
  });
});
