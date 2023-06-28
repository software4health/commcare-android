/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { Polygon } from 'react-leaflet';
import styled from 'styled-components';
import { AreaTooltip } from './AreaTooltip';
import { MAP_COLORS, BREWER_PALETTE } from '../constants';
import { ActivePolygon } from './ActivePolygon';
import {
  Color,
  ColorKey,
  Entity,
  GenericDataItem,
  MeasureData,
  OrgUnitCode,
  Series,
} from '../types';

const { POLYGON_BLUE, POLYGON_HIGHLIGHT } = MAP_COLORS;

const BasicPolygon = styled(Polygon)`
  fill: ${POLYGON_BLUE};
  fill-opacity: 0.04;
  stroke-width: 1;
  &:hover {
    fill-opacity: 0.5;
    stroke: ${POLYGON_HIGHLIGHT};
    fill: ${POLYGON_HIGHLIGHT};
  }
`;

const ShadedPolygon = styled(Polygon)`
  fill-opacity: 0.5;
  &:hover {
    fill-opacity: 0.8;
  }
`;

const TransparentShadedPolygon = styled(Polygon)`
  fill: ${POLYGON_BLUE};
  fill-opacity: 0;
  &:hover {
    fill-opacity: 0.1;
  }
`;

type OrgUnit = GenericDataItem & {
  isHidden?: boolean;
};

type ParsedPropsResult = {
  shade?: Color;
  isHidden?: boolean;
  hasShadedChildren: boolean;
  orgUnitMeasureData?: OrgUnit;
  orgUnitMultiOverlayMeasureData?: GenericDataItem;
};

const parseProps = (
  organisationUnitCode: OrgUnitCode = undefined,
  organisationUnitChildren: OrgUnit[],
  measureOrgUnits: OrgUnit[],
  multiOverlayMeasureData: MeasureData[],
): ParsedPropsResult => {
  let shade;
  let isHidden;
  let orgUnitMeasureData;
  let orgUnitMultiOverlayMeasureData;
  let hasShadedChildren = false;

  if (measureOrgUnits.length > 0) {
    const measureOrgUnitCodes = new Set(
      measureOrgUnits.map(orgUnit => orgUnit.organisationUnitCode),
    );

    hasShadedChildren =
      organisationUnitChildren &&
      organisationUnitChildren.some(child => measureOrgUnitCodes.has(child.organisationUnitCode));

    if (measureOrgUnitCodes.has(organisationUnitCode)) {
      orgUnitMultiOverlayMeasureData = multiOverlayMeasureData.find(
        orgUnit => orgUnit.organisationUnitCode === organisationUnitCode,
      );

      orgUnitMeasureData = measureOrgUnits.find(
        orgUnit => orgUnit.organisationUnitCode === organisationUnitCode,
      );

      if (orgUnitMeasureData) {
        shade = orgUnitMeasureData.color;
        isHidden = orgUnitMeasureData.isHidden;
      }
    }
  }

  return { shade, isHidden, hasShadedChildren, orgUnitMeasureData, orgUnitMultiOverlayMeasureData };
};

interface InteractivePolygonProps {
  isChildArea?: boolean;
  hasMeasureData?: boolean;
  multiOverlaySerieses?: Series[];
  multiOverlayMeasureData?: GenericDataItem[];
  permanentLabels?: boolean;
  onChangeOrgUnit?: (organisationUnitCode?: string) => void;
  area: Entity;
  isActive?: boolean;
  measureOrgUnits?: OrgUnit[];
  organisationUnitChildren?: GenericDataItem[];
}

export const InteractivePolygon = React.memo(
  ({
    isChildArea = false,
    hasMeasureData = false,
    multiOverlaySerieses = [],
    multiOverlayMeasureData = [],
    permanentLabels = true,
    onChangeOrgUnit = () => {},
    area,
    isActive = false,
    measureOrgUnits = [],
    organisationUnitChildren = [],
  }: InteractivePolygonProps) => {
    const { organisationUnitCode } = area;
    const coordinates = area.location?.region;
    const hasChildren = organisationUnitChildren && organisationUnitChildren.length > 0;

    const {
      shade,
      isHidden,
      hasShadedChildren,
      orgUnitMeasureData,
      orgUnitMultiOverlayMeasureData,
    } = parseProps(
      organisationUnitCode,
      organisationUnitChildren,
      measureOrgUnits,
      multiOverlayMeasureData,
    );

    if (isHidden || !coordinates) return null;

    if (isActive) {
      return (
        <ActivePolygon
          shade={shade}
          hasChildren={hasChildren}
          hasShadedChildren={hasShadedChildren}
          coordinates={coordinates}
          // Randomize key to ensure polygon appears at top. This is still important even
          // though the polygon is in a LayerGroup due to issues with react-leaflet that
          // maintainer says are out of scope for the module.
          key={`currentOrgUnitPolygon${Math.random()}`}
        />
      );
    }

    const getTooltip = () => {
      const hasMeasureValue = !!(orgUnitMeasureData || orgUnitMeasureData === 0);
      // don't render tooltips if we have a measure loaded
      // and don't have a value to display in the tooltip (ie: radius overlay)
      if (hasMeasureData && !hasMeasureValue) return null;

      // Render all measure data even it is not selected on switch button to display.
      return (
        <AreaTooltip
          permanent={permanentLabels && isChildArea && !hasMeasureValue}
          sticky={!permanentLabels}
          hasMeasureValue={hasMeasureValue}
          serieses={multiOverlaySerieses}
          orgUnitMeasureData={orgUnitMultiOverlayMeasureData}
          orgUnitName={area.name}
        />
      );
    };

    const tooltip = getTooltip();

    const defaultProps = {
      positions: coordinates,
      eventHandlers: {
        click: () => {
          return onChangeOrgUnit(organisationUnitCode);
        },
      },
    };

    if (shade) {
      if (shade === 'transparent') {
        return <TransparentShadedPolygon {...defaultProps}>{tooltip}</TransparentShadedPolygon>;
      }

      // To match with the color in markerIcon.js which uses BREWER_PALETTE
      const color = BREWER_PALETTE[shade as ColorKey] || shade;

      // Work around: color should go through the styled components
      // but there is a rendering bug between Styled Components + Leaflet
      return (
        <ShadedPolygon
          {...defaultProps}
          pathOptions={{
            color,
            fillColor: color,
          }}
        >
          {tooltip}
        </ShadedPolygon>
      );
    }

    return <BasicPolygon {...defaultProps}>{tooltip}</BasicPolygon>;
  },
);
