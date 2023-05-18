/*
 * Tupaia
 * Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 *
 */
import { BaseChartConfig } from '@tupaia/types';
import { COLOR_PALETTES } from '../constants';
import { ChartType, DataProps, ViewContent } from '../types';
import { isDataKey } from './utils';

const ADD_TO_ALL_KEY = '$all';

export const getLayeredOpacity = (
  numberOfLayers: number,
  index: number,
  ascending: boolean = false,
) => (ascending ? (index + 1) / numberOfLayers : 1 - index / numberOfLayers);

export const parseChartConfig = (viewContent: ViewContent) => {
  const { chartType, chartConfig = {}, data, colorPalette: paletteName } = viewContent;
  const { [ADD_TO_ALL_KEY]: configForAllKeys, ...restOfConfig } = chartConfig;

  const baseConfig = configForAllKeys
    ? createDynamicConfig(restOfConfig, configForAllKeys, data)
    : restOfConfig;

  const addDefaultColors = (config: BaseChartConfig) =>
    addDefaultColorsToConfig(config, paletteName, chartType);

  const chartConfigs = [baseConfig];

  return chartConfigs
    .map(sortChartConfigByLegendOrder)
    .map(addDefaultColors)
    .map(setOpacityValues)[0]; // must remove from array after mapping
};

/**
 * Sets numeric values for each chart config opacity
 */
const setOpacityValues = (chartConfig: BaseChartConfig): BaseChartConfig => {
  const newConfig = {};

  Object.entries(chartConfig).forEach(([key, configItem], index, array) => {
    const { opacity } = configItem;
    if (!opacity || typeof opacity === 'number') {
      newConfig[key] = configItem;
      return;
    }
    const newOpacity = getLayeredOpacity(array.length, index, opacity === 'ascending');
    newConfig[key] = { ...configItem, opacity: newOpacity };
  });
  return newConfig;
};

// Adds default colors for every element with no color defined
const addDefaultColorsToConfig = (
  chartConfig: BaseChartConfig,
  paletteName?: string,
  chartType: ChartType,
) => {
  const newConfig = {};

  const palette = paletteName || getDefaultPaletteName(chartType, Object.keys(chartConfig).length);
  const colors = Object.values(COLOR_PALETTES[palette]);

  let colorId = 0;
  Object.entries(chartConfig).forEach(([key, configItem]) => {
    let { color } = configItem;
    if (!color) {
      color = colors[colorId];
      colorId = (colorId + 1) % colors.length;
    }

    newConfig[key] = { ...configItem, color };
  });

  return newConfig;
};

const getDefaultPaletteName = (chartType: ChartType, numberRequired: number): string => {
  if (chartType === ChartType.Composed) {
    return 'COMPOSED_CHART_COLOR_PALETTE';
  }
  return numberRequired > Object.keys(COLOR_PALETTES.CHART_COLOR_PALETTE).length
    ? 'EXPANDED_CHART_COLOR_PALETTE'
    : 'CHART_COLOR_PALETTE';
};

// Used to layer line charts on top of bar charts for composed charts.
const CHART_SORT_ORDER = {
  [ChartType.Line]: 0,
  [ChartType.Bar]: 1,
};

const defaultSort = (a, b) => {
  return CHART_SORT_ORDER[b[1].chartType] - CHART_SORT_ORDER[a[1].chartType];
};

// Bad practice to rely on object ordering: https://stackoverflow.com/questions/9179680/is-it-acceptable-style-for-node-js-libraries-to-rely-on-object-key-order
const sortChartConfigByLegendOrder = (chartConfig: BaseChartConfig) => {
  return Object.entries(chartConfig)
    .sort(defaultSort)
    .sort(([, cfg1], [, cfg2]) => {
      if (isNaN(cfg1.legendOrder) && isNaN(cfg2.legendOrder)) return 0;
      if (isNaN(cfg1.legendOrder)) return 1;
      if (isNaN(cfg2.legendOrder)) return -1;
      return cfg1.legendOrder - cfg2.legendOrder;
    })
    .reduce(
      (newChartConfig, [key, val]) => ({
        ...newChartConfig,
        [key]: val,
      }),
      {},
    );
};

const createDynamicConfig = (
  chartConfig: BaseChartConfig,
  dynamicChartConfig: BaseChartConfig,
  data: DataProps[],
): BaseChartConfig => {
  // Just find keys. Doesn't include keys which end in _metadata.
  // @ts-ignore
  const dataKeys = data.map(dataPoint => Object.keys(dataPoint).filter(isDataKey)).flat();
  const keys = new Set(dataKeys);

  // Add config to each key
  const newChartConfig = {};
  keys.forEach(key => {
    newChartConfig[key] = { ...dynamicChartConfig, ...chartConfig[key] };
  });
  return newChartConfig;
};
