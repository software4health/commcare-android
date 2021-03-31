/**
 * Tupaia
 * Copyright (c) 2017 - 2021 Beyond Essential Systems Pty Ltd
 */

import { EntityModel as BaseEntityModel, EntityType as BaseEntityType } from '@tupaia/database';
import { Model, DbConditional } from './types';

export type EntityFields = Readonly<{
  id: string;
  code: string;
  name: string;
  country_code: string | null;
  type: string | null;
  image_url: string | null;
  region: string | null;
  point: string | null;
  bounds: string | null;
}>;

export interface EntityType extends EntityFields, Omit<BaseEntityType, 'id'> {
  getChildren: (
    hierarchyId: string,
    criteria?: DbConditional<EntityFields>,
  ) => Promise<EntityType[]>;
  getParent: (hierarchyId: string) => Promise<EntityType | undefined>;
  getDescendants: (
    hierarchyId: string,
    criteria?: DbConditional<EntityFields>,
  ) => Promise<EntityType[]>;
  getAncestorOfType: (hierarchyId: string, type: string) => Promise<EntityType>;
}

export interface EntityModel extends Model<BaseEntityModel, EntityFields, EntityType> {}
