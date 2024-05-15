import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Badge, Button, CircularProgress, Input, OutlinedInput, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import { Data, HeadCell } from '../types';
import EnhancedTableHead from './EnhancedTableHead';
import ConfirmationModal from './ConfirmationModal';
import { Album, Height } from '@mui/icons-material';
import CustomInput from './CustomInput';
import { useState } from 'react';



function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
}



interface ICommonDataTableProps {
    rows: Data[]; // Accept array of Data type for rows
    tabType: string;
    headCells: HeadCell[];
    loading: any;
    error: any;
    description: string;
    actionButtons: boolean;
    dynamicKey?: string;
    viewType: string;
    reloadActiveTab?: () => void
}
export default function CommonDataTable({ rows, tabType, headCells, loading, error, description, actionButtons, viewType, reloadActiveTab }: ICommonDataTableProps) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('singer');
    const [selected, setSelected] = React.useState<number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [filteredRows, setFilteredRows] = React.useState<Data[]>(rows);

    React.useEffect(() => {
        setSelected([]); // Clear selected items when rows change
    }, [rows]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows?.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        if (viewType == 'validate') {

            const selectedIndex = selected.indexOf(id);
            let newSelected: readonly number[] = [];
            if (
                (event.target as HTMLElement).closest('button') !== null ||
                (event.target as HTMLElement).closest('svg') !== null
            ) {
                return; // If clicked on a button or icon, do nothing
            }

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
                );
            }
            setSelected(newSelected);

        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows?.length - page * rowsPerPage);

    const [open, setOpen] = React.useState(false);
    const [actionType, setActionType] = React.useState<string>('approve');
    const [selectedIds, setSelectedIds] = React.useState<number>();
    const [dynamicValues, setSelectedDynamicValues] = React.useState<string[]>([]);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const approveRejectClick = (event: React.MouseEvent<unknown>, id: number, row: any, actionType: string) => {
        setSelectedDynamicValues([row.ALBUM]);
        setActionType(actionType);
        setOpen(true)
    };

    const [userInput, setInputValue] = useState('');

    const handleValueChange = (newValue) => {
        setInputValue(newValue);
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar tabType={tabType} numSelected={selected.length} description={description} rows={rows} selected={selected} dynamicKey={'ALBUM'} actionButtons={actionButtons} reloadActiveTab={reloadActiveTab} actionType={actionType} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                         {!loading && (
                            <>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows?.length}
                            rows={rows}
                            headCells={headCells}
                            viewType={viewType}
                            actionButtons={actionButtons}
                        />
                       
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    ?.map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.id)}
                                                role={actionButtons == true ? 'checkbox' : undefined}
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >

                                                <TableCell padding="checkbox">
                                                    {(actionButtons == true &&
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                        />
                                                    )}

                                                </TableCell>
                                                {headCells?.map((cell) => (
                                                    
                                                    <TableCell key={cell.id} style={{ maxWidth: '100px' }}>
                                                        {
                                                        typeof row[cell.id] === "string" && row[cell.id].includes("http") ?(
                                                        <div> 
                                                            
                                                            <img src={row[cell.id]} alt="Image" style={{height:'70px', borderRadius:'3PX', boxShadow:'rgb(0 0 0 / 12%) 0px 0px 3px 3px'}}/>

                                                        </div>

                                                    ) :
                                                        row[cell.id] == "R" ? (
                                                            <div> 
                                                            <Badge badgeContent="Rejected" sx={{
                                                                "& .MuiBadge-badge": {
                                                                    color: '#d48e8e',
                                                                    backgroundColor: "#f2e2e5"
                                                                }
                                                            }} />
                                                            </div>

                                                        ) : row[cell.id] == "C" ? (
                                                            <Badge badgeContent="Corrected" sx={{
                                                                "& .MuiBadge-badge": {
                                                                    color: '#1e8f9e',
                                                                    backgroundColor: "#d1faff"
                                                                }
                                                            }} />
                                                        ) : (
                                                            row[cell.id]
                                                        )}
                                                    </TableCell>
                                                ))}

                                                <TableCell>
                                                    {(actionButtons == true &&
                                                        <CustomInput onValueChange={handleValueChange} />
                                                    )}
                                                </TableCell>

                                                <TableCell align="right">
                                                    {(actionButtons == true &&

                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Tooltip title={'Reject'}>
                                                                <span>
                                                                    <Button
                                                                        onClick={(event) => approveRejectClick(event, row.id, row, 'reject')}
                                                                        disabled={selected.length > 1}
                                                                        variant="outlined"
                                                                        sx={{
                                                                            marginRight: '5PX',
                                                                            borderColor: '#ff4ac3',
                                                                            color: '#ff4ac3',
                                                                            '&:hover': {
                                                                                borderColor: '#ff4ac3',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <CloseIcon style={{ fontSize: '20px', padding: '0px 2px' }} />
                                                                    </Button>
                                                                </span>
                                                            </Tooltip>
                                                            <Tooltip title={'Approve'}>
                                                                <span>

                                                                    <Button
                                                                        onClick={(event) => approveRejectClick(event, row.id, row, 'approve')}
                                                                        disabled={selected.length > 1}
                                                                        variant="outlined"
                                                                        sx={{
                                                                            color: '#2573ff',
                                                                            borderColor: '#2573ff',
                                                                            '&:hover': {
                                                                                borderColor: '#2573ff',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <CheckIcon style={{ fontSize: '20px', padding: '0px 2px' }} />
                                                                    </Button>
                                                                </span>

                                                            </Tooltip>
                                                        </Box>
                                                    )}

                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}






                            </TableBody>
                            </>
                        )}
                        {!loading && rows.length < 1 && (
                            <TableBody>
                            <TableCell colSpan={headCells.length + 3}>
                                <div style={{ textAlign: 'center', padding: '100px' }}>
                                    <Box sx={{ display: 'inline-block' }}>

                                        No Data Found
                                    </Box>
                                </div>
                            </TableCell>
                        </TableBody>
                        )}
                        {loading && (
                            <TableBody>
                                <TableCell colSpan={headCells.length + 3}>
                                    <div style={{ textAlign: 'center', padding: '100px' }}>
                                        <Box sx={{ display: 'inline-block' }}>
                                            <CircularProgress />
                                        </Box>
                                    </div>
                                </TableCell>
                            </TableBody>
                        )}


                    </Table>
                    <Table>

                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
            <ConfirmationModal
                tabType={tabType}
                reloadActiveTab={reloadActiveTab}
                open={open}
                onClose={handleClose}
                numSelected={1}
                UserInput={userInput}
                selectedDynamicValues={dynamicValues}
                actionType={actionType}
            />
        </Box>

    );
}
