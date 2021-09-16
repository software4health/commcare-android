/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DownloadIcon from '@material-ui/icons/GetApp';
import { Dialog, DialogHeader, DialogContent } from '@tupaia/ui-components';
import { Table, useMapDataExport } from '@tupaia/ui-components/lib/map';
import MuiIconButton from '@material-ui/core/IconButton';
import {
  selectCurrentMeasure,
  selectOrgUnitCountry,
  selectRenderedMeasuresWithDisplayInfo,
} from '../../selectors';
import { MeasureOptionsGroupPropType } from '../../components/Marker/propTypes';
import { Tooltip } from '../../components/Tooltip';

const IconButton = styled(MuiIconButton)`
  margin: 0 0 0 1rem;
  padding: 10px 8px 10px 12px;
`;

export const MapTableModalComponent = ({
  currentCountry,
  currentMeasure,
  measureOptions,
  measureData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const title = `${currentMeasure?.name}, ${currentCountry?.name}`;
  const { doExport } = useMapDataExport(measureOptions, measureData, title);

  if (!currentMeasure || !measureData || !measureOptions || measureData.length === 0) {
    return null;
  }

  return (
    <>
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} maxWidth="lg">
        <DialogHeader onClose={() => setIsOpen(false)} title={title}>
          <MuiIconButton onClick={doExport}>
            <DownloadIcon />
          </MuiIconButton>
        </DialogHeader>
        <DialogContent>
          <Table serieses={measureOptions} measureData={measureData} />
        </DialogContent>
      </Dialog>
      <Tooltip arrow interactive placement="top" title="Generate Report">
        <IconButton onClick={() => setIsOpen(true)}>
          <AssignmentIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

MapTableModalComponent.propTypes = {
  measureOptions: MeasureOptionsGroupPropType,
  measureData: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
    }),
  ),
  currentCountry: PropTypes.string,
  currentMeasure: PropTypes.object,
};

MapTableModalComponent.defaultProps = {
  measureOptions: null,
  measureData: null,
  currentCountry: null,
  currentMeasure: null,
};

const mapStateToProps = state => {
  const { measureOptions } = state.map.measureInfo;
  const currentMeasure = selectCurrentMeasure(state);
  const measureData = selectRenderedMeasuresWithDisplayInfo(state);
  const currentCountry = selectOrgUnitCountry(state, state.map.measureInfo.currentCountry);

  return {
    currentMeasure,
    measureOptions,
    measureData,
    currentCountry,
  };
};

export const MapTableModal = connect(mapStateToProps)(MapTableModalComponent);