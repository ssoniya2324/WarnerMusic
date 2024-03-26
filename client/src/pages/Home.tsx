import * as React from 'react';
import {
  DataTable,
  HeaderTabs,
} from "../components";
import { GridColDef } from '@mui/x-data-grid';
import { Grid, Card, CardContent, Stack } from "@mui/material";
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
  return (
    <>
      <Grid container>
        <Grid item xs={2}></Grid>

        <Grid item xs={8}>
          <Stack flexDirection={'row'} paddingTop={1} paddingBottom={1}>
            <img src="https://w7.pngwing.com/pngs/224/120/png-transparent-warner-communications-logo-warner-music-group-warner-bros-graphic-design-thriller-text-logo-monochrome.png" style={{ height: '75px', width: 'min-content', marginRight: '20px' }} />
            <h1>Warner Music</h1>
          </Stack>
          <p style={{ fontSize: '20px', width: '64%', fontWeight: '100', lineHeight: '45px' }} > Get the non matching records of Singer, Region and Language from the latest etc .... </p>
          <Card>
            <HeaderTabs></HeaderTabs>
            <CardContent>
              <DataTable rows={rows} columns={columns}></DataTable>
            </CardContent>
          </Card>

        </Grid>

        <Grid item xs={2}></Grid>

      </Grid>

    </>
  );
};

export default Home;
