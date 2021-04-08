/**
 * Tupaia
 * Copyright (c) 2017 - 2021 Beyond Essential Systems Pty Ltd
 */
import { NextFunction, Response } from 'express';
import { PermissionsError } from '@tupaia/utils';
import { EntityType } from '../../../models';
import { HierarchyRequest } from '../types';
import { extractFieldsFromQuery, mapEntityToFields, mapEntitiesToFields } from './fields';

const notNull = <T>(value: T): value is Exclude<T, null> => value !== null;

const throwNoAccessError = (hierarchyName: string, entityCode: string) => {
  throw new PermissionsError(
    `No access to requested entity: ${entityCode} in hierarchy: ${hierarchyName}`,
  );
};

export const attachContext = async (req: HierarchyRequest, res: Response, next: NextFunction) => {
  try {
    const { entityCode, hierarchyName } = req.params;

    const hierarchy = await req.models.entityHierarchy.findOne({ name: hierarchyName });
    const entity = await req.models.entity.findOne({ code: entityCode });
    if (!hierarchy || !entity) {
      throwNoAccessError(hierarchyName, entityCode);
    }

    // Root type shouldn't be locked into being a project entity, see: https://github.com/beyondessential/tupaia-backlog/issues/2570
    const rootEntity = await entity.getAncestorOfType(hierarchy.id, 'project');

    const allowedCountries = (await rootEntity.getChildren(hierarchy.id))
      .map(child => child.country_code)
      .filter(notNull)
      .filter((countryCode, index, countryCodes) => countryCodes.indexOf(countryCode) === index) // De-duplicate countryCodes
      .filter(countryCode => req.accessPolicy.allows(countryCode));

    if (allowedCountries.length < 1) {
      throwNoAccessError(hierarchyName, entityCode);
    }

    if (
      !entity.isProject() &&
      (!notNull(entity.country_code) || !allowedCountries.includes(entity.country_code))
    ) {
      throwNoAccessError(hierarchyName, entityCode);
    }

    req.ctx.entity = entity;
    req.ctx.hierarchyId = hierarchy.id;
    req.ctx.allowedCountries = allowedCountries;
    req.ctx.fields = extractFieldsFromQuery(req.query.fields);
    req.ctx.formatEntityForResponse = (entityToFormat: EntityType) =>
      mapEntityToFields(req.ctx.fields)(entityToFormat, req.ctx);
    req.ctx.formatEntitiesForResponse = (entitiesToFormat: EntityType[]) =>
      mapEntitiesToFields(req, req.ctx.fields)(entitiesToFormat, req.ctx);

    next();
  } catch (error) {
    next(error);
  }
};