import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import { Data, HeadCell } from '../types';

type Order = 'asc' | 'desc';

interface EnhancedTableHeadProps {
    numSelected: number;
    order: Order;
    orderBy: string;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    rowCount: number;
    headCells: HeadCell[];
    actionButtons: boolean;
    viewType: string;
    rows:any;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, actionButtons,rows } = props;

    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };


    const uniqueStatusCodes = Array.from(new Set(rows.map(cell => cell.STATUS_CD).filter(status => status !== null)));

    // Step 2: Map STATUS_CD values to labels
    const statusCdOptions = uniqueStatusCodes.map(statusCode => ({
        value: statusCode,
        label: statusCode === 'R' ? 'Rejected' : 'Corrected',
    }));

    return (
        <TableHead>
            <TableRow>
                    <TableCell padding="checkbox" style={{ width: '70px' }}>
                    {actionButtons && rows.length > 0 && (

                        <Tooltip title={numSelected === rowCount ? 'Deselect All' : 'Select All'}>
                            <Checkbox
                                color="primary"
                                indeterminate={numSelected > 1 && numSelected < rowCount}
                                checked={rowCount > 1 && numSelected === rowCount}
                                onChange={onSelectAllClick}
                                inputProps={{
                                    'aria-label': 'select all',
                                }}
                            />
                        </Tooltip>
                )}

                    </TableCell>

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="left"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.id === "STATUS_CD" ? '' : headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}


                <TableCell></TableCell>
                <TableCell></TableCell>
            </TableRow>
        </TableHead>
    );
}

export default EnhancedTableHead;
