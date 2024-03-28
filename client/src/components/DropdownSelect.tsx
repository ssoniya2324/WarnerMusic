import * as React from 'react';
import { useEffect, useState } from 'react';
import { FormControl, MenuItem, Select, Checkbox, ListItemText, Box } from '@mui/material';

export function DropdownSelect({ options, isMulti, onSelectionChange, defaultSelection }) {
    const [selectedOptions, setSelectedOptions] = useState(isMulti ? [] : '');

    useEffect(() => {
      if (defaultSelection !== undefined && isMulti==false) {
          setSelectedOptions(defaultSelection);
      }
  }, [defaultSelection]);

    const handleChange = (event) => {
        const selected = event.target.value;
        setSelectedOptions(selected);

        // Call the callback function to inform the parent about selection change
        if (onSelectionChange) {
            onSelectionChange(selected);
        }
    };

    const handleSelectAll = () => {
        if (selectedOptions.length === options.length) {
            setSelectedOptions([]);
        } else {
            setSelectedOptions(options.map(option => option.value));
        }
    };

    const getSelectedLabels = () => {
        if (isMulti) {
            return selectedOptions.map(value => {
                const option = options.find(option => option.value === value);
                return option ? option.label : '';
            })
        } else {
            const option = options.find(option => option.value === selectedOptions);
            return option ? option.label : '';
        }
    };

    return (
        <FormControl variant="outlined" fullWidth>
            <Select
                multiple={isMulti}
                value={selectedOptions}
                onChange={handleChange}
                renderValue={() => {
                    const selectedLabels = getSelectedLabels();
                    if (isMulti) {
                        return (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selectedLabels.map((label, index) => (
                                    <React.Fragment key={label}>
                                        <Box sx={{ borderRadius: 1, bgcolor: 'background.paper', px: 1, paddingRight:'0px', paddingLeft:'0px' }}>
                                            {label}
                                        </Box>
                                        {index < selectedLabels.length - 1 && <>,</>}
                                    </React.Fragment>
                                ))}
                            </Box>
                        );
                    } else {
                        return selectedLabels;
                    }
                }}
                inputProps={{ 'aria-label': 'Without label' }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {isMulti && (
                            <Checkbox checked={selectedOptions.indexOf(option.value) > -1} />
                        )}
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
