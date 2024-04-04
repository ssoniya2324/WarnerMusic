import * as React from 'react';
import logo from '../logo.png';
import latentview from '../latentview.png';
import { Stack } from '@mui/material';

const Header = () => {
  return (
    <Stack flexDirection={'row'} paddingTop={1} paddingBottom={1}>
      <img src={logo} alt="Logo" style={{ height: '75px', width: 'min-content', marginRight: '20px' }} />
      <div style={{
        color: "rgb(255 255 255 / 85%)",
        fontSize: "21px",
        fontWeight: "100",
        borderLeft: "1px solid #ffffff73",
        paddingLeft: "12px",
        paddingTop: "12px",
      }}>
        <img src={latentview} alt="LatentView" style={{ height: "60px" }} />
        <span style={{ display: 'inline-block', verticalAlign: '12px' }}>
          Smart Data <br /> Assistant
        </span>
      </div>
    </Stack>
  );
};

export default Header;
