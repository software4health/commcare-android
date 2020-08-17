/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import formatLinkHeader from 'format-link-header';
import { JOIN_TYPES } from '@tupaia/database';
import { respond, ValidationError } from '@tupaia/utils';
import { RouteHandler } from './RouteHandler';
import { getApiUrl, resourceToRecordType } from '../utilities';

const MAX_RECORDS_PER_PAGE = 100;

// if the endpoint is /survey/5a5d1c66ae07fb3fb025c3a3/answer, the resource is 'survey'
const extractResourceFromEndpoint = endpoint => endpoint.split('/')[1];

/**
 * Responds to arbitrary GET requests to endpoints that relate to record types listed in the
 * GETTABLE_TYPES constant.
 * The endpoints should take the camel case form of the record, and be the plural form, unless you
 * are requesting a specific record by its id.
 * These endpoints also support pagination using 'pageSize' and 'page' query parameters, sorting
 * using the 'sort' query parameter, and filtering using any other query parameter.
 * As with most endpoints, you must also pass in a Bearer auth header with an access token
 * Examples:
 *     https://api.tupaia.org/v2/countries?sort=["name DESC"]
 *       Get all countries, sorted alphabetically by name in reverse order
 *     https://api.tupaia.org/v2/surveyResponse/5a5d1c66ae07fb3fb025c3a3
 *       Get a specific survey response
 *     https://api.tupaia.org/v2/surveyResponse/5a5d1c66ae07fb3fb025c3a3/answers
 *       Get the answers of a specific survey response
 *     https://api.tupaia.org/v2/answers?pageSize=100&page=3&filter={"survey_response_id":"5a5d1c66ae07fb3fb025c3a3"}
 *       Get the fourth page of 100 answers for a given survey response
 */
export class GETHandler extends RouteHandler {
  constructor(req, res) {
    super(req, res);
    const { database, query, endpoint } = req;
    this.database = database;
    this.query = query;
    this.resource = extractResourceFromEndpoint(endpoint);
    this.recordType = resourceToRecordType(this.resource);
  }

  /**
   * All GET handlers should provide a concrete permissions gate implementation.
   * This is the "gate" because there may be additional permissions filtering required in the body
   * of the handler, but the gate will check whether the user should have any access to the endpoint
   * whatsoever, and throw an error if they shouldn't get any further.
   */
  checkPermissionsGate() {
    throw new Error(`'checkPermissionsGate' must be implemented by every GETHandler`);
  }

  async handleRequest() {
    await this.checkPermissionsGate(); // run base permissions check for this endpoint
    const { headers = {}, body } = await this.buildResponse();
    Object.entries(headers).forEach(([key, value]) => this.res.set(key, value));
    respond(this.res, body);
  }

  getPaginationParameters() {
    const { pageSize: limit = MAX_RECORDS_PER_PAGE, page } = this.req.query;
    return { limit, page };
  }

  getDbQueryOptions() {
    const { columns: columnsString, sort: sortString, distinct = false } = this.req.query;

    // set up db query options
    const unprocessedColumns = columnsString && JSON.parse(columnsString);
    const { sort, multiJoin } = getQueryOptionsForColumns(unprocessedColumns, this.recordType);
    const columns = unprocessedColumns && processColumns(unprocessedColumns, this.recordType);

    const { limit, page } = this.getPaginationParameters();
    const offset = limit * page;

    const dbQueryOptions = { multiJoin, columns, sort, distinct, limit, offset };

    // add any user requested sorting to the start of the sort clause
    if (sortString) {
      const sortKeys = JSON.parse(sortString);
      const fullyQualifiedSortKeys = sortKeys.map(sortKey =>
        processColumnSelector(sortKey, this.recordType),
      );
      // if 'distinct', we can't order by any columns that aren't included in the distinct selection
      if (distinct) {
        dbQueryOptions.sort = fullyQualifiedSortKeys;
      } else {
        dbQueryOptions.sort.unshift(...fullyQualifiedSortKeys);
      }
    }

    return dbQueryOptions;
  }

  getRecordId() {
    const { recordId } = this.req.params;
    return recordId;
  }

  getDbQueryCriteria() {
    const { filter: filterString } = this.req.query;
    const filter = filterString ? JSON.parse(filterString) : {};
    return processColumnSelectorKeys(filter, this.recordType);
  }

  async buildResponse() {
    const options = this.getDbQueryOptions();

    // handle request for a single record
    const recordId = this.getRecordId();
    if (recordId) {
      const record = await this.findSingleRecord(recordId, options);
      return { body: record };
    }

    // handle request for multiple records, including pagination headers
    const criteria = this.getDbQueryCriteria();
    const pageOfRecords = await this.findRecords(criteria, options);
    const totalNumberOfRecords = await this.countRecords(criteria, options);
    const { limit, page } = this.getPaginationParameters();
    const lastPage = Math.ceil(totalNumberOfRecords / limit);
    const linkHeader = generateLinkHeader(this.resource, page, lastPage, this.req.query);
    return {
      headers: {
        Link: linkHeader,
        'Access-Control-Expose-Headers': 'Link', // To get around CORS
      },
      body: pageOfRecords,
    };
  }

  async countRecords(criteria, { multiJoin }) {
    const options = { multiJoin }; // only the join option is required for count
    return this.database.count(this.recordType, criteria, options);
  }

  async findRecords(criteria, options) {
    return this.database.find(this.recordType, criteria, options);
  }

  async findSingleRecord(recordId, options) {
    const [record] = await this.database.find(
      this.recordType,
      { [`${this.recordType}.id`]: recordId },
      options,
    );
    return record;
  }
}

function generateLinkHeader(resource, pageString, lastPage, originalQueryParameters) {
  const currentPage = parseInt(pageString, 10);

  const getUrlForPage = page => getApiUrl(resource, { ...originalQueryParameters, page });

  // We can always send through first and last, so start with that in the link header
  const linkHeader = {
    first: {
      url: getUrlForPage(0),
      rel: 'first',
    },
    last: {
      url: getUrlForPage(lastPage),
      rel: 'last',
    },
  };

  // If not the first page, generate a 'prev' link to the page before
  if (currentPage > 0) {
    linkHeader.prev = {
      url: getUrlForPage(currentPage - 1),
      rel: 'prev',
    };
  }

  // If not the last page, generate a 'next' link to the next page
  if (currentPage < lastPage) {
    linkHeader.next = {
      url: getUrlForPage(currentPage + 1),
      rel: 'next',
    };
  }

  return formatLinkHeader(linkHeader);
}

function processColumns(unprocessedColumns, recordType) {
  return unprocessedColumns.map(column => ({
    [column]: processColumnSelector(column, recordType),
  }));
}

function getQueryOptionsForColumns(columns, baseRecordType) {
  const sort = [`${baseRecordType}.id`];
  if (!columns) {
    return { sort };
  }
  if (columns.some(c => c.startsWith('_'))) {
    throw new ValidationError(
      'No columns start with "_", and conjunction operators are reserved for internal use only',
    );
  }
  const columnsNeedingJoin = columns.filter(column => column.includes('.'));
  const multiJoin = [];
  const recordTypesJoined = [];
  for (let i = 0; i < columnsNeedingJoin.length; i++) {
    // Split strings into the record type to join with and the column to select, e.g. if the column
    // is 'survey.name', split into 'survey' and 'name'
    const resourceName = columnsNeedingJoin[i].split('.')[0];
    const recordType = resourceToRecordType(resourceName);

    if (recordType !== baseRecordType && !recordTypesJoined.includes(recordType)) {
      multiJoin.push({
        joinType: JOIN_TYPES.LEFT_OUTER,
        joinWith: recordType,
        joinCondition: [`${recordType}.id`, `${resourceName}_id`],
      });
      recordTypesJoined.push(recordType);
    }
  }
  // Ensure every join table is added to the sort, so that queries are predictable during pagination
  sort.push(...recordTypesJoined.map(recordType => `${recordType}.id`));
  return { multiJoin, sort };
}

// Make sure all column keys have the table specified to avoid ambiguous column errors,
// and also transform any resource names into database record types
const processColumnSelectorKeys = (object, recordType) => {
  const processedObject = {};
  Object.entries(object).forEach(([columnSelector, value]) => {
    processedObject[processColumnSelector(columnSelector, recordType)] = value;
  });
  return processedObject;
};

const processColumnSelector = (unprocessedColumnSelector, baseRecordType) => {
  if (unprocessedColumnSelector.includes('.')) {
    const [recordType, column] = unprocessedColumnSelector.split('.');
    return `${resourceToRecordType(recordType)}.${column}`;
  }
  return `${baseRecordType}.${unprocessedColumnSelector}`;
};
