import * as React from 'react';
import { useState, useEffect } from 'react';
import {DropdownSelect,
} from "../components";
import { Grid, Card, CardContent, Stack, Tab, Tabs, Button, Box } from "@mui/material";
import useRegionData, { RegionData } from '../hooks/useRegionData';
import useSingerData, { SingerData } from '../hooks/useSingerData';
import useLanguageData, { LanguageData } from '../hooks/useLanguageData';
import CommonDataTable from '../components/CommonDataTable';

import logo from '../logo.png';

const Home: React.FC = () => {
  const [tabValue, setTabValue] = React.useState('Singer');
  const [singerTrigger, setSingerTrigger] = React.useState(false);
  const [regionTrigger, setRegionTrigger] = React.useState(false);
  const [languageTrigger, setLanguageTrigger] = React.useState(false);
  
  const [showTabs, setShowTabs] = React.useState(false);
  const [viewType, setViewType] = React.useState('view');
  const [selectedColumnValues, setColumnSelectedValues] = useState([]);
  const [selectedTableValues, setSelectedTableValues] = useState([]);

  const { data: singerData, loading: singerLoading, error: singerError } = useSingerData(singerTrigger,viewType);
  const { data: regionData, loading: regionLoading, error: regionError } = useRegionData(regionTrigger,viewType);
  const { data: languageData, loading: languageLoading, error: languageError } = useLanguageData(languageTrigger,viewType);


  const [singerBaseTrigger, setSingerBaseTrigger] = React.useState(false);
  const [regionBaseTrigger, setRegionBaseTrigger] = React.useState(false);
  const [languageBaseTrigger, setLanguageBaseTrigger] = React.useState(false);

  const { data: singerBaseData, loading: singerBaseLoading, error: singerBaseError } = useSingerData(singerBaseTrigger,viewType);
  const { data: regionBaseData, loading: regionBaseLoading, error: regionBaseError } = useRegionData(regionBaseTrigger,viewType);
  const { data: languageBaseData, loading: languageBaseLoading, error: languageBaseError } = useLanguageData(languageBaseTrigger,viewType);


  const singerDescription = "Validated Singer Records with non matched data";
  const regionDescription = "Validated Region Records with non matched data";
  const languageDescription = "Validated Language Records with non matched data";

  const singerBaseDescription = " Base Singer Records from table ";
  const regionBaseDescription = " Base Region Records from table ";
  const languageBaseDescription = " Base Language Records from table";

  const [selectedCheckboxCount, setSelectedCheckboxCount] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    triggerApiCall(newValue,viewType)
  };


  const triggerApiCall = (newValue: string, viewType: string) => {
    if (viewType === 'view') {
      if (newValue === 'Singer' || newValue === 'singer') {
        setSingerBaseTrigger(true);
      } else if (newValue === 'Region' || newValue === 'region') {
        setRegionBaseTrigger(true);
      } else if (newValue === 'Language' || newValue === 'language') {
        setLanguageBaseTrigger(true);
      }
    } else if (viewType === 'validate') {
      if (newValue === 'Singer' || newValue === 'singer') {
        setSingerTrigger(true);
      } else if (newValue === 'Region' || newValue === 'region') {
        setRegionTrigger(true);
      } else if (newValue === 'Language' || newValue === 'language') {
        setLanguageTrigger(true);
      }
    }
  };

  const handleCheckboxSelect = (count: number) => {
    setSelectedCheckboxCount(count);
  };


  useEffect(() => {
    setShowTabs(false); // Reset showTabs state whenever selectedColumnValues change
  }, [selectedColumnValues]);

  const handleValidateButtonClick = () => {
    setViewType('validate');
    setShowTabs(true);
    // Set the first tab active based on the selected column values
    if (selectedColumnValues.includes("singer")) {
      setTabValue('Singer');
      setSingerTrigger(true);
    } else if (selectedColumnValues.includes("region")) {
      setTabValue('Region');
      setRegionTrigger(true);

    } else if (selectedColumnValues.includes("language")) {
      setTabValue('Language');
      setLanguageTrigger(true);

    }
  };

  const handleViewButtonClick = () => {
    setViewType('view');
    setShowTabs(true);
    // Set the first tab active based on the selected column values
    if (selectedColumnValues.includes("singer")) {
      setTabValue('Singer');
      setSingerBaseTrigger(true);
    } else if (selectedColumnValues.includes("region")) {
      setTabValue('Region');
      setRegionBaseTrigger(true);

    } else if (selectedColumnValues.includes("language")) {
      setTabValue('Language');
      setLanguageBaseTrigger(true);

    }
  };
  

  // Define rows and columns data
  const rows = [
    { id: 1, singer: "Snow", predictedSinger: "Jon", album: "Dark" },
    { id: 2, singer: "Lannister", predictedSinger: "Cersei", album: "Sunshine" },
    // Add more rows as needed
  ];
  interface HeadCell{
    id:string;
    numeric:boolean;
    disablePadding:boolean;
    label:string;
  }

  // Define the column configuration
  const singerHeadCells : HeadCell[] = [
    {
      id: 'ALBUM',
      numeric: false,
      disablePadding: false,
      label: 'ALBUM',
    },
    {
      id: 'SINGER',
      numeric: false,
      disablePadding: false,
      label: 'SINGER',
    },
    {
      id: 'PREDICTED_SINGER',
      numeric: false,
      disablePadding: false,
      label: 'PREDICTED SINGER',
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: false,
      label: '',
    }
  ];
  const regionHeadCells : HeadCell[] = [
    {
      id: 'ALBUM',
      numeric: false,
      disablePadding: false,
      label: 'ALBUM',
    },
    {
      id: 'SINGER',
      numeric: false,
      disablePadding: false,
      label: 'SINGER',
    },
    {
      id: 'REGION',
      numeric: false,
      disablePadding: false,
      label: 'REGION',
    },
    {
      id: 'PREDICTED_REGION',
      numeric: false,
      disablePadding: false,
      label: 'PREDICTED REGION',
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: false,
      label: '',
    }
  ];
  const languageHeadCells : HeadCell[] = [
    {
      id: 'ALBUM',
      numeric: false,
      disablePadding: false,
      label: 'ALBUM',
    },
    {
      id: 'SINGER',
      numeric: false,
      disablePadding: false,
      label: 'SINGER',
    },
    {
      id: 'LANGUAGE',
      numeric: false,
      disablePadding: false,
      label: 'LANGUAGE',
    },
    {
      id: 'PREDICTED_LANGUAGE',
      numeric: false,
      disablePadding: false,
      label: 'PREDICTED LANGUAGE',
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: false,
      label: '',
    }
  ];


  const singerBaseHeadCells : HeadCell[] = [
    {
      id: 'ALBUM',
      numeric: false,
      disablePadding: false,
      label: 'ALBUM',
    },
    {
      id: 'SINGER',
      numeric: false,
      disablePadding: false,
      label: 'SINGER',
    }
  ];
  const regionBaseHeadCells : HeadCell[] = [
    {
      id: 'ALBUM',
      numeric: false,
      disablePadding: false,
      label: 'ALBUM',
    },
  
    {
      id: 'REGION',
      numeric: false,
      disablePadding: false,
      label: 'REGION',
    }
  ];
  const languageBaseHeadCells : HeadCell[] = [
    {
      id: 'ALBUM',
      numeric: false,
      disablePadding: false,
      label: 'ALBUM',
    },
   
    {
      id: 'LANGUAGE',
      numeric: false,
      disablePadding: false,
      label: 'LANGUAGE',
    }
  ];

  interface item{
    value:string;
    label:string;
  }
  const tableOptions:item[] = [
    { value: 'Table', label: 'Table Name' },
  ];

  const columnOptions = [
    { value: 'singer', label: 'Singer' },
    { value: 'region', label: 'Region' },
    { value: 'language', label: 'Language' },
  ];

  const handleTableSelectionChange = (selected) => {
    setSelectedTableValues(selected);
  };

  const handleColumnSelectionChange = (selected) => {
    setColumnSelectedValues(selected);
  };

  const reloadActiveTab =()=>{
   if(tabValue == 'Singer'){
    setSingerTrigger(!singerTrigger)
    if(singerTrigger == true){
     setSelectedTableValues([])
    }
   } 
   else if(tabValue == 'Region'){
    setRegionTrigger(!regionTrigger)
    if(regionTrigger == true){
     setSelectedTableValues([])
    }
   } else if(tabValue == 'Language'){
    setLanguageTrigger(!languageTrigger)
    if(languageTrigger == true){
     setSelectedTableValues([])
    }
   }
 
  }

  return (
    <>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Stack flexDirection={'row'} paddingTop={1} paddingBottom={1}>
            <img src={logo} style={{ height: '75px', width: 'min-content', marginRight: '20px' }} />
          </Stack>
          <div style={{ marginTop: '120px' }}>
            <Card style={{padding:'35px', marginBottom:'30px'}}>
              <Grid container>
                <Grid xs={5} style={{padding:'10px'}}>
                  <Box textAlign="left" paddingBottom="5px" fontWeight="fontWeightBold">
                    Table
                  </Box>
                  <DropdownSelect options={tableOptions} isMulti={false}  selectedValues={selectedTableValues} onSelectionChange={handleTableSelectionChange} defaultSelection={"Table"} />
                </Grid>
                <Grid xs={5} style={{padding:'10px'}}>
                  <Box textAlign="left" paddingBottom="5px" fontWeight="fontWeightBold">
                    Columns
                  </Box>
                  <DropdownSelect options={columnOptions} isMulti={true } selectedValues={selectedColumnValues} onSelectionChange={handleColumnSelectionChange}/>
                </Grid>
                <Grid xs={2} style={{padding:'35px 10px 0px', textAlign:'right'}} >
                  <Button disabled={selectedColumnValues.length <1 && selectedTableValues.length < 1} variant='contained' onClick={handleViewButtonClick}>View</Button> &nbsp;
                  <Button disabled={selectedColumnValues.length <1 && selectedTableValues.length < 1} variant='contained' onClick={handleValidateButtonClick}>Validate</Button>
                </Grid>
              </Grid>
            </Card>
            {!showTabs && (
              <div style={{textAlign:'center',padding:'30px'}}>
              <p style={{fontSize:'20px',color:'#4673c3'}}> Please choose table and columns to view / validate ! </p>
              </div>

            )}
            {showTabs && (
              <div>
                <Tabs sx={{ borderBottom: '1px solid #eee', background:'#FFEB3B' }} value={tabValue} onChange={handleTabChange} >
                  { selectedColumnValues.includes("singer") && <Tab value="Singer" label="Singer" />}
                  { selectedColumnValues.includes("region") && <Tab value="Region" label="Region" />}
                  { selectedColumnValues.includes("language") && <Tab value="Language" label="Language" />}
                </Tabs>
                {viewType === 'validate' && (
                <div style={{padding:'0px 0px'}}>
                  {tabValue === 'Singer' && selectedColumnValues.includes("singer") && (
                    <CommonDataTable viewType={viewType} tabType={'singer'} rows={singerData} headCells={singerHeadCells} loading={singerLoading} error={singerError} description={singerDescription}   actionButtons={true} reloadActiveTab={reloadActiveTab} />
                  )}
                  {tabValue === 'Region' && selectedColumnValues.includes("region") && (
                    <CommonDataTable viewType={viewType}  tabType={'region'}  rows={regionData} headCells={regionHeadCells} loading={regionLoading} error={regionError} description={regionDescription}   actionButtons={true}  reloadActiveTab={reloadActiveTab} />
                  )}
                  {tabValue === 'Language' && selectedColumnValues.includes("language") && (
                    <CommonDataTable  viewType={viewType}  tabType={'language'}  rows={languageData} headCells={languageHeadCells} loading={languageLoading} error={languageError} description={languageDescription}   actionButtons={true} reloadActiveTab={reloadActiveTab} />
                  )}
                </div>

                )}
                                {viewType === 'view' && (
                <div style={{padding:'0px 0px'}}>
                  {tabValue === 'Singer' && selectedColumnValues.includes("singer") && (
                    <CommonDataTable rows={singerBaseData} headCells={singerBaseHeadCells} loading={singerBaseLoading} error={singerBaseError} description={singerBaseDescription}  actionButtons={false} />
                  )}
                  {tabValue === 'Region' && selectedColumnValues.includes("region") && (
                    <CommonDataTable rows={regionBaseData} headCells={regionBaseHeadCells} loading={regionBaseLoading} error={regionBaseError} description={regionBaseDescription}   actionButtons={false}/>
                  )}
                  {tabValue === 'Language' && selectedColumnValues.includes("language") && (
                    <CommonDataTable rows={languageBaseData} headCells={languageBaseHeadCells} loading={languageBaseLoading} error={languageBaseError} description={languageBaseDescription}   actionButtons={false} />
                  )}
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
