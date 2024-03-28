import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { Box, Button, Tooltip } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox'; // Import Checkbox from Material-UI

interface RowData {
  id: number;
  album: string;
  singer: string;
  predictedSinger: string;
}

interface DataTableProps {
  rows: RowData[];
  columns: GridColDef[];
  onCheckboxSelect: (count: number) => void;
}

export function DataTable({ rows, columns, onCheckboxSelect }: DataTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const selectedRowIds = checked ? rows.map(row => row.id) : [];
    setSelectedRows(selectedRowIds);
    onCheckboxSelect(selectedRowIds.length);
  };

  const handleRowCheckboxClick = (id: number) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: number[] = [];
  
    if (selectedIndex === -1) {
      newSelected = [...selectedRows, id];
    } else if (selectedIndex === 0) {
      newSelected = selectedRows.slice(1);
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = selectedRows.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selectedRows.slice(0, selectedIndex),
        ...selectedRows.slice(selectedIndex + 1),
      ];
    }
    setSelectedRows(newSelected);
  onCheckboxSelect(newSelected.length);
};

  const isSelected = (id: number) => selectedRows.indexOf(id) !== -1;

  const updatedColumns = [
    {
      field: 'checkbox',
      headerName: (
        <Tooltip title="select all">
        <Checkbox
          color="primary"
          onChange={handleSelectAllClick}
          inputProps={{ 'aria-label': 'Select all rows' }}
        />
        </Tooltip>
      ),
      width: 70,
      sortable: false,
      renderCell: (params: any) => (
        <Checkbox
          color="primary"
          checked={isSelected(params.row.id)}
          onChange={() => handleRowCheckboxClick(params.row.id)}
        />
      ),
    },
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 200,
      renderCell: (params: any) => (
        <Box sx={{ textAlign: 'right' }}>
          <Tooltip title={'Reject'}>
            <Button
            disabled={isAnyRowSelected}
              variant="outlined"
              sx={{
                borderColor: '#ff4ac3',
                color: '#ff4ac3',
                '&:hover': {
                  borderColor: '#ff4ac3',
                },
              }}
              onClick={() => handleReject(params.row.id)}
            >
              <CloseIcon style={{ fontSize: '20px', padding: '0px 2px' }} />
            </Button>
          </Tooltip>
          &nbsp;
          <Tooltip title={'Approve'}>
            <Button
              variant="outlined"
              disabled={isAnyRowSelected}
              sx={{
                color: '#2573ff',
                borderColor: '#2573ff',
                '&:hover': {
                  borderColor: '#2573ff',
                },
              }}
              onClick={() => handleApprove(params.row.id)}
            >
              <CheckIcon style={{ fontSize: '20px', padding: '0px 2px' }} />
            </Button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleApprove = (id: number) => {
    console.log(`Approved row with ID ${id}`);
  };

  const handleReject = (id: number) => {
    console.log(`Rejected row with ID ${id}`);
  };

  const isAnyRowSelected = selectedRows.length > 0;

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={updatedColumns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 100]}
        pagination
        autoHeight
      />
    </div>
  );
}
