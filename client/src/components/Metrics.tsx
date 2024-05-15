import { Box, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import * as React from "react";
import Highcharts from "highcharts"; // Import Highcharts library
import HighchartsReact from "highcharts-react-official";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import "../styles/style.css";

interface MetricsProps {
  data: {
    rejected_count: number;
    total_count: number;
    corrected_count: number;
    mismatched_count:number;
  };
  loading:boolean;
}
export default function Metrics(props: MetricsProps) {
  const { rejected_count, total_count, corrected_count, mismatched_count } = props.data;
  const loading = props.loading;
  // Calculate percentages
  const rejectedPercentage = ((rejected_count / total_count) * 100).toFixed(2);
  const correctedPercentage = ((corrected_count / total_count) * 100).toFixed(2);
  const mismatchedPercentage = ((mismatched_count / total_count) * 100).toFixed(2);


  return (
    <div className="metriccard">

      <Grid container spacing={2} >
        <Grid item xs={12}>
        {!loading && (
          <Grid container spacing={2} >
            <Grid item xs={3}>

              <div className="cardy">

                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    Total 
                    <br />
                    <b>{total_count}</b>
                  </Grid>
                  <Grid item xs={4}>
                  <div className="circ">
                  {!loading && (
                    <CircularProgressbar
                      value={100}
                      text={`100%`}
                      strokeWidth={6} 
                  styles={buildStyles({
                    textSize: '18px',
                        pathColor: '#3f51b5',
                        textColor: '#3f51b5',
                      })}
                    />
                  )}
                    </div>
                  </Grid>
                </Grid>


              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="cardy">
              <Grid container spacing={2}>
                  <Grid item xs={8}>
              Mismatched Count
                <br />
                <b>{mismatched_count}</b>
                <br />
                </Grid>
                <Grid item xs={4}>
                <div className="circ">
                {!loading && (

                <CircularProgressbar
                  value={parseFloat(mismatchedPercentage)}
                  text={`${mismatchedPercentage}%`}
                  strokeWidth={6} 
                  styles={buildStyles({
                    textSize: '18px',
                    pathColor: '#0096FF',
                    textColor: '#0096FF',
                  })}
                />
                )}
                </div></Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="cardy">
              <Grid container spacing={2}>
                  <Grid item xs={8}>
                Corrected 
                <br />
                <b>{corrected_count}</b>
                <br />
                </Grid>
                <Grid item xs={4}>
                <div className="circ">
                {!loading && (

                <CircularProgressbar
                  value={parseFloat(correctedPercentage)}
                  text={`${correctedPercentage}%`}
                  strokeWidth={6} 
                  styles={buildStyles({
                    textSize: '18px',
                    pathColor: '#4caf50',
                    textColor: '#4caf50',
                  })}
                />
                )}
                </div></Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="cardy">

                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    Rejected 
                    <br />
                    <b>{rejected_count}</b>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="circ">
                  {!loading && (
                      
                    <CircularProgressbar
                      value={parseFloat(rejectedPercentage)}
                      text={`${rejectedPercentage}%`}
                      strokeWidth={6} 
                      styles={buildStyles({
                        textSize: '18px',
                        pathColor: '#f50057',
                        textColor: '#f50057',
                      })}
                    />
                  )}

</div>
                  </Grid>
                </Grid>


              </div>
            </Grid>
          </Grid>
        )}
        </Grid>
      </Grid>
        

{loading && (
                           
                           <div style={{ textAlign: 'center', padding: '40px' }}>
                               <Box sx={{ display: 'inline-block' }}>
                                   <CircularProgress />
                               </Box>
                           </div>
                      
               )}

    </div>
  );
}
