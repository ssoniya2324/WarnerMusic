import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export function HeaderTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (

    <>
      <Tabs sx={{ borderBottom: '1px solid #eee' }} value={value} onChange={handleChange} variant="fullWidth">
        <Tab label="Singer" />
        <Tab label="Region" />
        <Tab label="Language" />
      </Tabs>
    </>
  )

}