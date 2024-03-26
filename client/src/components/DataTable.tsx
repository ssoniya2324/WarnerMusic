import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { Button, Tooltip } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface RowData {
  id: number;
  album: string;
  singer: string;
  predictedSinger: string;
}

interface DataTableProps {
  rows: RowData[];
  columns: GridColDef[];
}

export function DataTable({ rows, columns }: DataTableProps) {
  const updatedColumns = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 300,
      renderCell: (params: any) => (
        <div>
          <Tooltip title={'Reject'}>
            <Button variant="outlined" sx={{
              borderColor: '#de7b8c',
              color: '#de7b8c',
              '&:hover': {
                borderColor: '#de7b8c',
              },
            }} > <CloseIcon style={{ fontSize: '20px', padding: '0px 2px' }} /> </Button>
          </Tooltip>
          &nbsp;
          <Tooltip title={'Approve'}>

            <Button variant="outlined" sx={{
              color: 'teal',
              borderColor: 'teal',
              '&:hover': {
                borderColor: 'teal',
              },
            }}> <CheckIcon style={{ fontSize: '20px', padding: '0px 2px' }} /></Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleApprove = (id: number) => {
    console.log(`Approved row with ID ${id}`);
  };

  const handleReject = (id: number) => {
    console.log(`Rejected row with ID ${id}`);
  };

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={updatedColumns}
        checkboxSelection
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
