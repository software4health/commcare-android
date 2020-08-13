import React from 'react';
import { ResourcePage } from './ResourcePage';
import { prettyArray } from '../../utilities/pretty';

const FIELDS = [
  {
    Header: 'Code',
    source: 'code',
  },
  {
    Header: 'Name',
    source: 'name',
  },
  {
    Header: 'Organisation Level',
    source: 'organisationLevel',
    editConfig: {
      optionsEndpoint: 'dashboardGroups',
      optionLabelKey: 'organisationLevel',
      optionValueKey: 'organisationLevel',
      sourceKey: 'organisationLevel',
    },
  },
  {
    Header: 'Organisation Unit Code',
    source: 'organisationUnitCode',
    editConfig: {
      optionsEndpoint: 'entities',
      optionLabelKey: 'code',
      optionValueKey: 'code',
      sourceKey: 'organisationUnitCode',
    },
  },
  {
    Header: 'Permission Group',
    source: 'userGroup',
    editConfig: {
      optionsEndpoint: 'permissionGroups',
      optionLabelKey: 'name',
      optionValueKey: 'name',
      sourceKey: 'userGroup',
    },
  },
  {
    Header: 'Project Codes',
    source: 'projectCodes',
    Cell: ({ value }) => prettyArray(value),
    editConfig: {
      optionsEndpoint: 'projects',
      optionLabelKey: 'code',
      optionValueKey: 'code',
      sourceKey: 'projectCodes',
      allowMultipleValues: true,
    },
  },
  {
    Header: 'Dashboard Reports',
    source: 'dashboardReports',
    Cell: ({ value }) => prettyArray(value),
    editConfig: {
      optionsEndpoint: 'dashboardReports',
      optionLabelKey: 'id',
      sourceKey: 'dashboardReports',
      allowMultipleValues: true,
    },
  },
];

const COLUMNS = [
  ...FIELDS,
  {
    Header: 'Edit',
    type: 'edit',
    source: 'id',
    actionConfig: {
      editEndpoint: 'dashboardGroups',
      fields: [...FIELDS],
    },
  },
];

export const DashboardGroupsPage = () => (
  <ResourcePage
    title="Dashboard Groups"
    endpoint="dashboardGroups"
    columns={COLUMNS}
    editConfig={{
      title: 'Edit Dashboard Group',
    }}
  />
);