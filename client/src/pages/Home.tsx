import * as React from 'react';
import {
  DataTable,
} from "../components";
import { GridColDef } from '@mui/x-data-grid';
import { Grid, Card, CardContent, Stack, Tab, Tabs } from "@mui/material";
import useRegionData, { RegionData } from '../hooks/useRegionData';
import useSingerData, { SingerData } from '../hooks/useSingerData';
import useLanguageData, { LanguageData } from '../hooks/useLanguageData';



interface RowData {
  id: number;
  album: string;
  singer: string;
  predictedSinger: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'album',
    headerName: 'Album',
    type: 'string',
    width: 180
  },
  { field: 'predictedSinger', headerName: 'Predicted Singer', width: 180 },
  { field: 'singer', headerName: 'Singer', width: 180 },
];

const rows: RowData[] =
  [
    { id: 1, singer: "Snow", predictedSinger: "Jon", album: "Dark" },
    { id: 2, singer: "Lannister", predictedSinger: "Cersei", album: "Sunshine" },
    { id: 3, singer: "Lannister", predictedSinger: "Jaime", album: "Marshmallow" },
    { id: 4, singer: "Stark", predictedSinger: "Arya", album: "Fire works" },
    { id: 5, singer: "Targaryen", predictedSinger: "Daenerys", album: "Rock Music" },
    { id: 6, singer: "Melisandre", predictedSinger: "Arya", album: "Sunshine" },
    { id: 7, singer: "Clifford", predictedSinger: "Ferrara", album: "Marshmallow" },
    { id: 8, singer: "Frances", predictedSinger: "Rossini", album: "Dark" },
    { id: 9, singer: "Roxie", predictedSinger: "Harvey", album: "Fire works" },
    { id: 10, singer: "Snow", predictedSinger: "Jon", album: "Rock Music" },
    { id: 11, singer: "Lannister", predictedSinger: "Cersei", album: "Sunshine" },
    { id: 12, singer: "Lannister", predictedSinger: "Jaime", album: "Fire works" },
    { id: 13, singer: "Stark", predictedSinger: "Arya", album: "Marshmallow" },
    { id: 14, singer: "Targaryen", predictedSinger: "Daenerys", album: "Sunshine" },
    { id: 15, singer: "Melisandre", predictedSinger: "Arya", album: "Dark" },
    { id: 16, singer: "Clifford", predictedSinger: "Ferrara", album: "Rock Music" },
    { id: 17, singer: "Frances", predictedSinger: "Rossini", album: "Marshmallow" },
    { id: 18, singer: "Roxie", predictedSinger: "Harvey", album: "Dark" },
    { id: 19, singer: "Snow", predictedSinger: "Jon", album: "Fire works" },
    { id: 20, singer: "Lannister", predictedSinger: "Cersei", album: "Sunshine" },
    { id: 21, singer: "Lannister", predictedSinger: "Jaime", album: "Marshmallow" },
    { id: 22, singer: "Stark", predictedSinger: "Arya", album: "Rock Music" },
    { id: 23, singer: "Targaryen", predictedSinger: "Daenerys", album: "Dark" },
    { id: 24, singer: "Melisandre", predictedSinger: "Arya", album: "Marshmallow" },
    { id: 25, singer: "Clifford", predictedSinger: "Ferrara", album: "Sunshine" },
    { id: 26, singer: "Frances", predictedSinger: "Rossini", album: "Fire works" },
    { id: 27, singer: "Roxie", predictedSinger: "Harvey", album: "Rock Music" }
  ]

  const Home: React.FC = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const [singerTrigger, setSingerTrigger] = React.useState(false);
    const [regionTrigger, setRegionTrigger] = React.useState(false);
    const [languageTrigger, setLanguageTrigger] = React.useState(false);

  
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
      if (newValue === 1) {
        setSingerTrigger(true);
      } else if (newValue === 2) {
        setRegionTrigger(true);
      }
      else if (newValue === 3) {
        setLanguageTrigger(true);
      }
    };
  
    const { data: singerData, loading: singerLoading, error: singerError } = useSingerData(singerTrigger);
    const { data: regionData, loading: regionLoading, error: regionError } = useRegionData(regionTrigger);
    const { data: languageData, loading: languageLoading, error: languageError } = useLanguageData(languageTrigger);

  
    return (
      <>
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Stack flexDirection={'row'} paddingTop={1} paddingBottom={1}>
              <img src="https://w7.pngwing.com/pngs/224/120/png-transparent-warner-communications-logo-warner-music-group-warner-bros-graphic-design-thriller-text-logo-monochrome.png" style={{ height: '75px', width: 'min-content', marginRight: '20px' }} />
              <h1>Warner Music</h1>
            </Stack>
            <p style={{ fontSize: '20px', width: '64%', fontWeight: '100', lineHeight: '45px' }} > Get the non-matching records of Singer, Region, and Language from the latest etc .... </p>
            <Card>
              <Tabs sx={{ borderBottom: '1px solid #eee' }} value={tabValue} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Design"/>
                <Tab label="Singer" />
                <Tab label="Region" />
                <Tab label="Language" />

              </Tabs>
              <CardContent>
                {tabValue === 0 && <DataTable rows={rows} columns={columns}></DataTable>}
                {tabValue === 1 && (
                  <>
                    {singerLoading && <div>Loading...</div>}
                    {singerError && <div>{singerError.message}</div>}
                    <h1>Singer Data</h1>
                    <ul>
                      {singerData.map((item: SingerData, index: number) => (
                        <li key={index}>
                          Call Center ID: {item.CC_CALL_CENTER_ID}, Name: {item.CC_NAME}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {tabValue === 2 && (
                  <>
                    {regionLoading && <div>Loading...</div>}
                    {regionError && <div>{regionError.message}</div>}
                    <h1>Region Data</h1>
                    <ul>
                      {regionData.map((item: RegionData, index: number) => (
                        <li key={index}>
                          Call Center ID: {item.CC_CALL_CENTER_ID}, Name: {item.CC_NAME}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {tabValue === 3 && (
                  <>
                    {languageLoading && <div>Loading...</div>}
                    {languageError && <div>{languageError.message}</div>}
                    <h1>Language Data</h1>
                    <ul>
                      {languageData.map((item: LanguageData, index: number) => (
                        <li key={index}>
                          Call Center ID: {item.CC_CALL_CENTER_ID}, Name: {item.CC_NAME}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </>
    );
  };
  
  export default Home;