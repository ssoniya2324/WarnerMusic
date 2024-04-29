import * as React from 'react';
import { useEffect, useState } from 'react';
import { FormControl, MenuItem, Select, Checkbox, ListItemText, Box } from '@mui/material';

export function DropdownSelect({ options, isMulti, onSelectionChange, defaultSelection, isDisabled }) {
    const [selectedOptions, setSelectedOptions] = useState(isMulti ? [] : '');
    const isAllSelected = options.length > 0 && selectedOptions.length === options.length;

    useEffect(() => {
        if (defaultSelection !== undefined && isMulti == false) {
            setSelectedOptions(defaultSelection);
        }
    }, [defaultSelection]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        if (value[value.length - 1] === 'selectAll') {
            // "Select All" was last clicked
            setSelectedOptions(isAllSelected ? [] : options.map(option => option.value));
            if (onSelectionChange) {
                onSelectionChange(isAllSelected ? [] : options.map(option => option.value));
            }
        } else {
            setSelectedOptions(value);
            if (onSelectionChange) {
                onSelectionChange(value);
            }
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
                disabled={isDisabled}
                renderValue={selected => (typeof selected === 'string' ? selected : selected.join(', '))}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 48 * 4.5 + 8,
                            width: 250,
                        },
                    },
                }}
            // other props
            >
                {isMulti && (
                    <MenuItem value="selectAll">
                        <Checkbox checked={isAllSelected || false} />
                        <ListItemText primary="Select All" />
                    </MenuItem>
                )}
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
