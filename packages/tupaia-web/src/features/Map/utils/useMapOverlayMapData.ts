/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import { useParams } from 'react-router';
import { useEntitiesWithLocation, useEntity, useMapOverlays } from '../../../api/queries';
import { useMapOverlayTableData } from './useMapOverlayTableData.ts';
import { Entity } from '../../../types';

/*
 * This hook is used to get the sibling and immediate child entities for displaying navigation polygons on the map
 */
const useNavigationEntities = (projectCode, activeEntity, isPolygonSerieses, measureLevel) => {
  const rootEntityCode = activeEntity?.parentCode || activeEntity?.code;

  const { data = [] } = useEntitiesWithLocation(
    projectCode,
    rootEntityCode,
    {
      params: {
        includeRootEntity: false,
        filter: {
          generational_distance: 2,
        },
      },
    },
    { enabled: !!rootEntityCode },
  );

  // Don't show nav entities for the selected measure level
  const filteredData = data?.filter(
    entity => !measureLevel || measureLevel?.toLowerCase() !== entity.type.toLowerCase(),
  );

  // For polygon overlays, show navigation polygons for sibling entities only
  if (isPolygonSerieses) {
    return filteredData?.filter(entity => entity.type === activeEntity.type);
  }

  // For point overlays or no selected overlay,
  // show navigation polygons for sibling entities and immediate children
  return filteredData?.filter(
    entity => entity.parentCode === activeEntity.code || entity.type === activeEntity.type,
  );
};

const getRootEntityCode = (entity?: Entity) => {
  if (!entity) {
    return undefined;
  }
  const { parentCode, code, type } = entity;

  // If the active entity is a country we don't show visuals for neighbouring countries, so just make
  // the root entity the country
  if (type === 'country' || !parentCode) {
    return code;
  }

  // The default behaviour is to show visuals from the parent down which means that visuals will normally
  // show for entities outside the active entity.
  return parentCode;
};

export const useMapOverlayMapData = (hiddenValues = {}) => {
  const { projectCode, entityCode } = useParams();
  const { data: entity } = useEntity(projectCode, entityCode);
  const { selectedOverlay, isPolygonSerieses } = useMapOverlays(projectCode, entityCode);
  const entityRelatives = useNavigationEntities(
    projectCode,
    entity,
    isPolygonSerieses,
    selectedOverlay?.measureLevel,
  );

  // Get the relatives (siblings and immediate children) of the active entity for displaying navigation polygons
  const relativesMeasureData = entityRelatives?.map(entity => {
    return {
      ...entity,
      organisationUnitCode: entity.code,
      coordinates: entity.point,
      region: entity.region,
      permanentTooltip: !selectedOverlay,
    };
  });

  const rootEntityCode = getRootEntityCode(entity);

  // Get the main visual entities (descendants of root entity for the selected visual) and their data for displaying the visual
  const mapOverlayData = useMapOverlayTableData({ hiddenValues, rootEntityCode });

  // Combine the main visual entities and relatives for the polygon layer. The entities need to come after the
  // entityRelatives so that the active entity is rendered on top of the relatives
  const measureData = [...(relativesMeasureData || []), ...(mapOverlayData?.measureData || [])];

  return { ...mapOverlayData, measureData };
};