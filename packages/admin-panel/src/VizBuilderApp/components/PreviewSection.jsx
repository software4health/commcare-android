/*
 * Tupaia
 *  Copyright (c) 2017 - 2021 Beyond Essential Systems Pty Ltd
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import MuiTab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import { FlexSpaceBetween, FetchLoader, DataGrid } from '@tupaia/ui-components';
import { Chart } from '@tupaia/ui-chart-components';
import { JsonEditor } from '../../widgets';
import { TabPanel } from './TabPanel';
import { useReportPreview } from '../api';
import { usePreviewData, useVisualisation, useVizConfig, useVizConfigError } from '../context';
import { IdleMessage } from './IdleMessage';
import { getReportPreviewColumns, getReportPreviewRows } from '../../utilities';

const PreviewTabs = styled(MuiTabs)`
  background: white;
  border: 1px solid ${({ theme }) => theme.palette.grey['400']};
  border-bottom: none;

  .MuiTabs-indicator {
    height: 5px;
  }
`;

const PreviewTab = styled(MuiTab)`
  font-size: 15px;
  line-height: 140%;
  font-weight: 400;
  min-width: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const PanelTabPanel = styled.div`
  flex: 1;
  background: white;
  border: 1px solid ${({ theme }) => theme.palette.grey['400']};
  border-top: none;
`;

const Container = styled(FlexSpaceBetween)`
  align-items: stretch;
  flex-wrap: wrap;
  height: 100%;
`;

const TableContainer = styled.div`
  display: flex;
  height: 100%;
`;

const ChartContainer = styled.div`
  display: flex;
  padding: 4rem 2rem 2rem;
  max-height: 550px;
  min-height: 450px;
  min-width: 540px;
  flex: 2;
  border-top: 1px solid ${({ theme }) => theme.palette.grey['400']};
`;

const EditorContainer = styled.div`
  min-width: 440px;
  min-height: 500px;
  flex: 1;
  border-top: 1px solid ${({ theme }) => theme.palette.grey['400']};
  border-left: 1px solid ${({ theme }) => theme.palette.grey['400']};

  > div {
    width: 100%;
    height: 100%;
  }

  .jsoneditor {
    border: none;
  }
`;

const TABS = {
  DATA: {
    index: 0,
    label: 'Data Preview',
    previewMode: 'data',
  },
  CHART: {
    index: 1,
    label: 'Chart Preview',
    previewMode: 'presentation',
  },
};

const getTab = index => Object.values(TABS).find(tab => tab.index === index);

export const PreviewSection = () => {
  const [tab, setTab] = useState(0);

  const { fetchEnabled, setFetchEnabled, showData } = usePreviewData();
  const { hasPresentationError, setPresentationError } = useVizConfigError();

  const [
    { project, location, startDate, endDate, testData, visualisation },
    { setPresentation },
  ] = useVizConfig();
  const { visualisationForFetchingData } = useVisualisation();

  const [viewContent, setViewContent] = useState(null);

  const { dashboardItemOrMapOverlay } = useParams();

  const {
    data: reportData = { columns: [], rows: [] },
    isLoading,
    isFetching,
    isError,
    error,
  } = useReportPreview({
    visualisation: visualisationForFetchingData,
    project,
    location,
    startDate,
    endDate,
    testData,
    enabled: fetchEnabled,
    onSettled: () => {
      setFetchEnabled(false);
    },
    dashboardItemOrMapOverlay,
    previewMode: getTab(tab).previewMode,
  });

  const handleChange = (event, newValue) => {
    setTab(newValue);
    setFetchEnabled(true);
  };

  const handleInvalidPresentationChange = errMsg => {
    setPresentationError(errMsg);
  };

  const setPresentationValue = value => {
    setPresentation(value);
    setPresentationError(null);
  };

  const columns = useMemo(() => (tab === 0 ? getReportPreviewColumns(reportData) : []), [
    reportData,
  ]);
  const rows = useMemo(() => (tab === 0 ? getReportPreviewRows(reportData.rows) || [] : []), [
    reportData,
  ]);
  const data = useMemo(() => reportData, [reportData]);

  // only update Chart Preview when play button is clicked
  useEffect(() => {
    const newViewContent = { data, ...visualisation.presentation };
    setViewContent(newViewContent);
  }, [fetchEnabled]);

  return (
    <>
      <PreviewTabs
        value={tab}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
      >
        <PreviewTab label={TABS.DATA.label} disabled={hasPresentationError} />
        <PreviewTab label={TABS.CHART.label} />
      </PreviewTabs>
      <TabPanel isSelected={getTab(tab) === TABS.DATA} Panel={PanelTabPanel}>
        <TableContainer>
          {showData ? (
            <FetchLoader
              isLoading={isLoading || isFetching}
              isError={isError}
              error={error}
              isNoData={!rows.length}
              noDataMessage="No Data Found"
            >
              <DataGrid rows={rows} columns={columns} autoPageSize />
            </FetchLoader>
          ) : (
            <IdleMessage />
          )}
        </TableContainer>
      </TabPanel>
      <TabPanel isSelected={getTab(tab) === TABS.CHART} Panel={PanelTabPanel}>
        <Container>
          <ChartContainer>
            {showData ? (
              <FetchLoader isLoading={isLoading || isFetching} isError={isError} error={error}>
                <Chart viewContent={viewContent} />
              </FetchLoader>
            ) : (
              <IdleMessage />
            )}
          </ChartContainer>
          <EditorContainer>
            <JsonEditor
              value={visualisation.presentation}
              onChange={setPresentationValue}
              onInvalidChange={handleInvalidPresentationChange}
              mode="code"
              mainMenuBar={false}
            />
          </EditorContainer>
        </Container>
      </TabPanel>
    </>
  );
};
