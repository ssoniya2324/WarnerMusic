import { Card, CardContent, Grid, Typography } from "@mui/material";
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
  };
}
export default function Metrics(props: MetricsProps) {
  const { rejected_count, total_count, corrected_count } = props.data;

  // Calculate percentages
  const rejectedPercentage = ((rejected_count / total_count) * 100).toFixed(2);
  const correctedPercentage = ((corrected_count / total_count) * 100).toFixed(2);

  return (
    <div className="metriccard">
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Grid container spacing={2} >
            <Grid item xs={4}>

              <div className="cardy">

                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    Total 
                    <br />
                    <b>{total_count}</b>
                  </Grid>
                  <Grid item xs={3}>
                  <div className="circ">

                    <CircularProgressbar
                      value={100}
                      text={`100%`}
                      strokeWidth={8} 
                      styles={buildStyles({
                        textSize: '18px',
                        pathColor: '#3f51b5',
                        textColor: '#3f51b5',
                      })}
                    />
                    </div>
                  </Grid>
                </Grid>


              </div>
            </Grid>
           
            <Grid item xs={4}>
              <div className="cardy">
              <Grid container spacing={2}>
                  <Grid item xs={9}>
                Corrected 
                <br />
                <b>{corrected_count}</b>
                <br />
                </Grid>
                <Grid item xs={3}>
                <div className="circ">

                <CircularProgressbar
                  value={parseFloat(correctedPercentage)}
                  text={`${correctedPercentage}%`}
                  strokeWidth={8} 
                  styles={buildStyles({
                    textSize: '18px',
                    pathColor: '#4caf50',
                    textColor: '#4caf50',
                  })}
                />
                </div></Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="cardy">

                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    Rejected 
                    <br />
                    <b>{rejected_count}</b>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="circ">
                      
                    <CircularProgressbar
                      value={parseFloat(rejectedPercentage)}
                      text={`${rejectedPercentage}%`}
                      strokeWidth={8} 
                      styles={buildStyles({
                        textSize: '18px',
                        pathColor: '#f50057',
                        textColor: '#f50057',
                      })}
                    />

</div>
                  </Grid>
                </Grid>


              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
