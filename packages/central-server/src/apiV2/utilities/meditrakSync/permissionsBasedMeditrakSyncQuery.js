/**
 * Tupaia
 * Copyright (c) 2017 - 2022 Beyond Essential Systems Pty Ltd
 */

import { SqlQuery } from '@tupaia/database';
import { getCountriesAndPermissionsToSync } from './getCountriesAndPermissionsToSync';
import {
  extractSinceValue,
  deletesSinceLastSync,
  getModifiers,
  recordTypeFilter,
  selectFromClause,
} from './meditrakSyncQuery';
import {
  PERMISSIONS_BASED_SYNC_MIN_APP_VERSION,
  supportsPermissionsBasedSync,
} from './supportsPermissionsBasedSync';

/**
 * Since all countries, permission_groups, and country entities regardless of permissions
 */
export const permissionsFreeChanges = since => {
  const recordTypesToAlwaysSync = ['country', 'permission_group'];

  return {
    query: `change_time > ? AND (record_type IN ${SqlQuery.record(
      recordTypesToAlwaysSync,
    )} OR entity_type = ?)`,
    params: [since, ...recordTypesToAlwaysSync, 'country'],
  };
};

export const changesWithPermissions = (countryIds, permissionGroups, since) => {
  let query = 'change_time > ? AND "type" = ?';
  const params = [since, 'update'];

  if (countryIds) {
    query = query.concat(` AND country_ids && ${SqlQuery.array(countryIds, 'text')}`);
    params.push(...countryIds);
  } else {
    query = query.concat(` AND country_ids IS NULL`);
  }

  if (permissionGroups) {
    query = query.concat(` AND permission_groups && ${SqlQuery.array(permissionGroups, 'text')}`);
    params.push(...permissionGroups);
  } else {
    query = query.concat(` AND permission_groups IS NULL`);
  }

  return {
    query,
    params,
  };
};

/**
 * Sync logic for the permissions based sync:
 *
 * The meditrak-app sends across a list of all previously synced countries and permission groups when syncing (none if first time sync)
 * The app then just combines these lists with the countries and permissions in the user's access policy
 *   - For countries and permission groups that have previously been synced, just sync new changes since last sync
 *   - For countries and permission groups that have never been synced, sync data for all time for those
 *   - Note: all models that we sync can be filtered by countries, or both countries and permission groups, so no other information is needed
 * Once the sync is complete, the app then updates the list of synced countries and permission groups
 *
 */
export const buildPermissionsBasedMeditrakSyncQuery = async (
  req,
  { select, sort, limit, offset },
) => {
  const { appVersion } = req.query;
  if (!appVersion) {
    throw new Error("Must provide 'appVersion' url parameter");
  }

  if (!supportsPermissionsBasedSync(appVersion)) {
    throw new Error(
      `Permissions based sync is not supported for appVersion: ${appVersion}, must be ${PERMISSIONS_BASED_SYNC_MIN_APP_VERSION} or higher`,
    );
  }

  const since = extractSinceValue(req);
  const permissionBasedFilter = await getCountriesAndPermissionsToSync(req);

  const query = new SqlQuery();
  const { unsynced, synced } = permissionBasedFilter;

  query.append(selectFromClause(select));
  query.append(`WHERE (
  `);

  query.append('(');
  query.append(permissionsFreeChanges(since));
  query.append(')');

  if (unsynced.countries) {
    // Never before synced countries due to new country permissions
    query.append(` 
    OR (`);
    query.append(changesWithPermissions(unsynced.countryIds, null, 0));
    query.append(')');
  }

  if (unsynced.countries && unsynced.permissionGroups) {
    // Never before synced surveys due to new permission groups and country permissions
    query.append(` 
    OR (`);
    query.append(changesWithPermissions(unsynced.countryIds, unsynced.permissionGroups, 0));
    query.append(')');
  }

  if (unsynced.countries && synced.permissionGroups) {
    // Never before synced surveys due to new country permissions
    query.append(` 
    OR (`);
    query.append(changesWithPermissions(unsynced.countryIds, synced.permissionGroups, 0));
    query.append(')');
  }

  if (synced.countries && unsynced.permissionGroups) {
    // Never before synced surveys due to new permission groups
    query.append(` 
    OR (`);
    query.append(changesWithPermissions(synced.countryIds, unsynced.permissionGroups, 0));
    query.append(')');
  }

  if (synced.countries) {
    // Previously synced countries
    query.append(` 
    OR (`);
    query.append(changesWithPermissions(synced.countryIds, null, since));
    query.append(')');
  }

  if (synced.countries && synced.permissionGroups) {
    // Previously synced surveys
    query.append(` 
    OR (`);
    query.append(changesWithPermissions(synced.countryIds, synced.permissionGroups, since));
    query.append(')');
  }

  query.append(`
    OR (`);
  query.append(deletesSinceLastSync(since));
  query.append(`
    ))`);

  const filter = await recordTypeFilter(req);
  if (filter) {
    query.append(`
      AND `);
    query.append(filter);
  }

  query.append(getModifiers(sort, limit, offset));

  const countriesInSync = [...(unsynced.countries || []), ...(synced.countries || [])];
  const permissionGroupsInSync = [
    ...(unsynced.permissionGroups || []),
    ...(synced.permissionGroups || []),
  ];

  return {
    query,
    countries: countriesInSync,
    permissionGroups: permissionGroupsInSync,
  };
};
