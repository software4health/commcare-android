/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { VIEW_STYLES } from '../../../styles';
import { formatDataValue } from '../../../utils';
import { VALUE_TYPES } from '../constants';
import { PRESENTATION_OPTIONS_SHAPE } from '../propTypes';
import { formatTimestampForChart, getIsTimeSeries } from './helpers';

function formatLabelledValue(label, value, valueType, metaData) {
  const valueText = formatDataValue(value, valueType, metaData);
  if (label) {
    return `${label}: ${valueText}`;
  }
  return valueText;
}

const MultiValueTooltip = ({
  valueType,
  presentationOptions,
  payload,
  periodGranularity,
  labelType,
}) => {
  const data = payload[0].payload;
  // console.log(payload);
  const { name: headline, timestamp } = data;
  const valueLabels = payload.map(({ dataKey, value }) => {
    const options = presentationOptions && presentationOptions[dataKey];
    const label = (options && options.label) || dataKey;
    const valueTypeForLabel =
      labelType || valueType || get(presentationOptions, [dataKey, 'valueType']);
    const metaData = data[`${dataKey}_metaData`];

    return <li key={dataKey}>{formatLabelledValue(label, value, valueTypeForLabel, metaData)}</li>;
  });

  return (
    <div style={VIEW_STYLES.tooltip}>
      {headline ||
        (getIsTimeSeries([data]) &&
          periodGranularity &&
          formatTimestampForChart(timestamp, periodGranularity))}
      <ul>{valueLabels}</ul>
    </div>
  );
};

const SingleValueTooltip = ({ valueType, payload, periodGranularity, metaData }) => {
  console.log(metaData);
  const data = payload[0].payload;
  const { name, value, timestamp } = data;

  return (
    <div style={VIEW_STYLES.tooltip}>
      {getIsTimeSeries([payload[0].payload]) && periodGranularity ? (
        <div>
          <p>{formatTimestampForChart(timestamp, periodGranularity)}</p>
          {formatDataValue(value, valueType)}
        </div>
      ) : (
        formatLabelledValue(name, value, valueType)
      )}
    </div>
  );
};

function Tooltip(props) {
  if (props.active) {
    if (props.payload.length === 1 && !props.presentationOptions) {
      return <SingleValueTooltip {...props} />;
    }
    return <MultiValueTooltip {...props} />;
  }
  return null;
}

/* eslint-disable */
// disable eslint on these as we don't have a lot of control over
// what kind of props recharts uses
Tooltip.propTypes = {
  valueType: PropTypes.oneOf(Object.values(VALUE_TYPES)),
  payload: PropTypes.any,
  presentationOptions: PropTypes.shape(PRESENTATION_OPTIONS_SHAPE),
};

SingleValueTooltip.propTypes = Tooltip.propTypes;
MultiValueTooltip.propTypes = Tooltip.propTypes;
/* eslint-enable */

export default Tooltip;
