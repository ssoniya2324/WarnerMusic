import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { Button, Card, Chip, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { act } from 'react-dom/test-utils';
interface Data {
    id: number;
    [key: string]: any; // Dynamic keys for additional columns
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    description:string;
    selected:any;
    rows: Data[]; 
    dynamicKey: string; 
    actionButtons:boolean;
}

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
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headCells: HeadCell[];
    actionButtons:boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, actionButtons } = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" style={{width:'70px'}}>
                {(actionButtons == true &&

                <Tooltip title={numSelected === rowCount ? "Deselect All" : "Select All"}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all',
                        }}
                    />
                    </Tooltip>
                )}

                </TableCell>
                {props.headCells.map((headCell) => (
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
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell>
                    
                </TableCell>
            </TableRow>
        </TableHead>
    );
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    
    p: 4,
  };
  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const numSelected = props.numSelected;
    const description = props.description;
    const selected = props.selected; 
    const rows = props.rows;
    const dynamicKey = props.dynamicKey;
    const actionButtons = props.actionButtons;

    const [open, setOpen] = React.useState(false);
    const [cardId, setCardId] = React.useState("question"); // State to track the current card id
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]); // State to hold selected IDs

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const selectedDynamicValues = rows
        .filter(row => selected.includes(row.id))
        .map(row => row[dynamicKey]);

    React.useEffect(() => {
        setSelectedIds([...selected]);
    }, [props.numSelected]);
    

    const apiCallApprove = () => {
        // Perform API call here
        // Upon successful response, switch to the "answer" card
        setCardId("answer");
    };

    return (
        <Toolbar
            sx={{
                background: "rgb(255 235 59 / 28%)",
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{
                        flex: '1 1 100%',
                        color: "#585858",
                        fontSize: "15px",
                        fontWeight: '100'
                    }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {description}
                </Typography>
            )}
            {(numSelected > 0 && actionButtons == true) ? (
                <>
                    <Tooltip title="Reject all selected">
                        <Button
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
                            <CloseIcon style={{ fontSize: '15px', padding: '0px 2px' }} /> Reject
                        </Button>
                    </Tooltip>
                    <Tooltip title="Approve all selected">
                        <Button
                            variant="outlined"
                            sx={{
                                color: '#2573ff',
                                borderColor: '#2573ff',
                                '&:hover': {
                                    borderColor: '#2573ff',
                                },
                            }}
                            onClick={handleOpen}
                        >
                            <CheckIcon style={{ fontSize: '15px', padding: '0px 2px' }} /> Approve
                        </Button>
                    </Tooltip>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            {cardId === "question" && ( // Display "question" card if cardId is "question"
                                <Card id="question" style={{ padding: '30px', textAlign: 'left', width:'100%' }}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Approve {numSelected} selected records
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 3 }}>
                                   
                    {selectedDynamicValues.map((value, index) => (
                        <Chip key={index} label={value} style={{     color: '#1566a7',
                            background: 'rgb(33 150 243 / 26%)', marginRight: '5px',marginBottom:'5px' }} />
                    ))}
                                    </Typography>
                                    <div style={{ textAlign: 'right', padding: '40px 0px 0px' }}>
                                        <Button onClick={handleClose} variant='outlined'>Cancel</Button> &nbsp;
                                        <Button onClick={apiCallApprove} variant='contained'>Approve</Button>
                                    </div>
                                </Card>
                            )}
                            {cardId === "answer" && ( // Display "answer" card if cardId is "answer"
                                <Card id="answer" style={{ padding: '30px', textAlign: 'center' }}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Approved Successfully !!
                                    </Typography>
                                    <div style={{ textAlign: 'center', padding: '40px 0px 0px' }}>
                                        <Button onClick={handleClose} variant='outlined'>Okay</Button> &nbsp;
                                    </div>
                                </Card>
                            )}
                        </Box>
                    </Modal>
                </>
            ) : (
                ''
            )}
        </Toolbar>
    );
}


interface HeadCell {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
}

interface ICommonDataTableProps {
    rows: Data[]; // Accept array of Data type for rows
    headCells: HeadCell[];
    loading:any;
    error:any;
    description:string;
    actionButtons:boolean;
}
export default function CommonDataTable({ rows, headCells, loading, error, description, actionButtons}: ICommonDataTableProps) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('singer');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} description={description} rows={rows} selected={selected} dynamicKey={'ALBUM'} actionButtons={actionButtons}  />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            headCells={headCells}
                            actionButtons={actionButtons}
                        />
                                        {!loading && (
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
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
                                            {headCells.map((cell) => (
                                                <TableCell key={cell.id} style={{maxWidth:'100px'}}>
                                                    {row[cell.id]}
                                                </TableCell>
                                            ))}
                                            <TableCell align="right">
                                            {(actionButtons == true && 

                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Tooltip title={'Reject'}>
                                                        <Button
                                                            disabled={selected.length > 0}
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
                                                    </Tooltip>
                                                    <Tooltip title={'Approve'}>
                                                        <Button
                                                            disabled={selected.length > 0}
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
                                                    </Tooltip>
                                                </Box>
                                            )}

                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (                               
                                 <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={headCells.length + 2} />
                                </TableRow>
                            )}
                        

                           


                        </TableBody>
                                        )}
                {loading && (
                        <TableBody>
                            <TableCell colSpan={headCells.length+2}>
                            <div style={{textAlign:'center', padding:'100px'}}>Loading...</div>
                  {error && <div>{error.message}</div>}
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
                    count={rows.length}
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
        </Box>
    );
}
