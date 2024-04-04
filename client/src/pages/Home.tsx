import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Tab, Tabs } from "@mui/material";
import useBaseData, { BaseData } from '../hooks/useBaseData';
import CommonDataTable from '../components/CommonDataTable';
import Header from '../components/Header';
import TableSelection from '../components/TableSelection';
import { useGenericData } from '../hooks/useGenericData';

function createDynamicHeadCells(data) {
  if (!data || data.length === 0) return [];

  const excludeKeys = ['id', 'STATUS_CD'];
  const firstItemKeys = Object.keys(data[0]).filter(key => !excludeKeys.includes(key));

  const formatKey = (key: string): string => {
    const parts = key.split('_').map(part =>
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    );
    return parts.join(' ');
  };

  const dynamicHeadCells = firstItemKeys.map(key => ({
    id: key, // Use the original key
    numeric: false,
    disablePadding: false,
    label: formatKey(key), // Use the formatted label
  }));

  const staticColumns = [
    {
      id: 'userChoice',
      numeric: false,
      disablePadding: false,
      label: '',
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: false,
      label: '',
    },
  ];

  return [...dynamicHeadCells, ...staticColumns];
}

function createHeadCells(data) {
  const uniqueKeys = new Set();

  data.forEach(obj => {
    Object.keys(obj).forEach(key => {
      if (key !== 'id') {
        uniqueKeys.add(key);
      }
    });
  });

  const headCells = Array.from(uniqueKeys).map(key => ({
    id: key,
    numeric: false,
    disablePadding: false,
    label: key
  }));

  return headCells;
}

interface item {
  value: string;
  label: string;
}
const Home: React.FC = () => {

  const columnOptions = [
    { value: 'singer', label: 'Singer' },
    { value: 'region', label: 'Region' },
    { value: 'language', label: 'Language' },
  ];

  const tableOptions: item[] = [
    { value: 'Music', label: 'Music' },
  ];
  const baseDescription = "Base records from selected table - Music";

  const firstColumnValue = columnOptions[0];
  const formattedTabValue = firstColumnValue.value
  const [tabValue, setTabValue] = React.useState(formattedTabValue);

  const [showTabs, setShowTabs] = React.useState(false);
  const [viewType, setViewType] = React.useState('view');
  const [selectedColumnValues, setColumnSelectedValues] = useState([]);
  const [selectedTableValues, setSelectedTableValues] = useState([]);
  const [activeDataType, setActiveDataType] = useState('');
  const [baseTrigger, setBaseTrigger] = React.useState(0);
  const [forceRefreshData, setForceRefreshData] = useState(0);
  const [visitedTabs, setVisitedTabs] = React.useState({});

  const { data: baseData, loading: baseLoading, error: baseError } = useBaseData(baseTrigger, selectedColumnValues);
  const { data, loading, error } = useGenericData(activeDataType, forceRefreshData);
  
  const baseHeadCells = createHeadCells(baseData);


  useEffect(() => {
    if (viewType == 'validate') {
      setShowTabs(false);
    }
  }, [selectedColumnValues]);
  const handleValidateButtonClick = () => {
    setViewType('validate');
    setShowTabs(true);

    if (selectedColumnValues.length > 0) {
      const firstColumnValue = selectedColumnValues[0];
      const formattedTabValue = firstColumnValue.charAt(0).toUpperCase() + firstColumnValue.slice(1);
      setTabValue(formattedTabValue);

      setActiveDataType(firstColumnValue);
      setVisitedTabs({});
      const firstColumnFormatted = firstColumnValue.toLowerCase();
      setVisitedTabs({
        [firstColumnFormatted]: true,
      });

      setForceRefreshData(prev => prev + 1);
    } else {
    }
  };

  const handleViewButtonClick = () => {
    setViewType('view');
    setShowTabs(true);
    setBaseTrigger(prev => prev + 1);
  }

  const handleTableSelectionChange = (selected) => {
    setSelectedTableValues(selected);
  };

  const handleColumnSelectionChange = (selected) => {
    setColumnSelectedValues(selected);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    const formattedDataType = newValue.toLowerCase();

    if (!visitedTabs[formattedDataType]) {
      setVisitedTabs(prevVisitedTabs => {
        const updatedVisitedTabs = { ...prevVisitedTabs, [formattedDataType]: true };
        return updatedVisitedTabs;
      });

      setForceRefreshData(prev => prev + 1);
      setActiveDataType(formattedDataType);

    } else {
      setForceRefreshData(0);
      setActiveDataType(formattedDataType);
    }


  };

  const reloadActiveTab = () => {
    setSelectedTableValues([])
    setTabValue(tabValue);
    setForceRefreshData(prev => prev + 1);

  }

  return (
    <>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Header />
          <div style={{ marginTop: '70px' }}>
            <TableSelection
              tableOptions={tableOptions}
              columnOptions={columnOptions}
              selectedTableValues={selectedTableValues}
              selectedColumnValues={selectedColumnValues}
              handleTableSelectionChange={handleTableSelectionChange}
              handleColumnSelectionChange={handleColumnSelectionChange}
              handleViewButtonClick={handleViewButtonClick}
              handleValidateButtonClick={handleValidateButtonClick}
            />

            {!showTabs && (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <p style={{ fontSize: '20px', color: '#4673c3' }}> Please choose table and columns to view / validate ! </p>
              </div>

            )}
            {showTabs && (
              <div>
                {viewType === 'validate' &&
                  <Tabs
                    sx={{ borderBottom: '1px solid #eee', background: '#FFEB3B' }}
                    value={tabValue}
                    onChange={handleTabChange}
                  >
                    {selectedColumnValues.map((columnValue) => (
                      <Tab
                        key={columnValue}
                        value={columnValue.charAt(0).toUpperCase() + columnValue.slice(1)} // Capitalize the first letter
                        label={columnValue.charAt(0).toUpperCase() + columnValue.slice(1)} // Capitalize the first letter
                      />
                    ))}
                  </Tabs>
                }
                {viewType === 'validate' && selectedColumnValues.includes(tabValue.toLowerCase()) && (
                  <div style={{ padding: '0px 0px' }}>

                    {showTabs && viewType === 'validate' && selectedColumnValues.includes(tabValue.toLowerCase()) && (
                      <CommonDataTable
                        viewType={viewType}
                        tabType={tabValue.toLowerCase()}
                        rows={data}
                        headCells={createDynamicHeadCells(data)}
                        loading={loading}
                        error={error}
                        description={`${tabValue} Data Description`}
                        actionButtons={viewType === 'validate'}
                        reloadActiveTab={reloadActiveTab}
                      />
                    )}
                  </div>

                )}
                {viewType === 'view' && (
                  <div style={{ padding: '0px 0px' }}>

                    <CommonDataTable rows={baseData} headCells={baseHeadCells} loading={baseLoading} error={baseError} description={baseDescription} actionButtons={false} />

                  </div>
                )}
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </>
  );
};

export default Home;
