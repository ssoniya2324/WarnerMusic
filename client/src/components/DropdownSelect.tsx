import * as React from 'react';
import { FormControl, MenuItem, Select, Box } from '@mui/material';
export function DropdownSelect() {
    const [age, setAge] = React.useState('');
  
    const handleChange = (event:any) => {
      setAge(event.target.value);
    };

  return (

    <>
   <FormControl variant="outlined" fullWidth>
      <Box textAlign="left" paddingBottom="5px" fontWeight="fontWeightMedium">
        Select an Option
      </Box>
      <Select
        value={age}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
       
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
      </>
  )
   
}