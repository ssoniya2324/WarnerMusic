import * as React from "react";
import { Grid, Box, Button, Card } from "@mui/material";
import { DropdownSelect } from ".";

// Props should include the selection options and handlers for changes
const TableSelection = ({ tableOptions, columnOptions, selectedTableValues, selectedColumnValues, handleTableSelectionChange, handleColumnSelectionChange, handleViewButtonClick, handleValidateButtonClick }) => {
  return (
    <Card style={{ padding: '35px', marginBottom: '30px' }}>
      <Grid container>
        <Grid item xs={5} style={{ padding: '10px' }}>
          <Box textAlign="left" paddingBottom="5px" fontWeight="fontWeightBold">
            Table
          </Box>
          <DropdownSelect
            options={tableOptions}
            isMulti={false}
            selectedValues={selectedTableValues}
            onSelectionChange={handleTableSelectionChange}
            defaultSelection={"Music"}
          />
        </Grid>
        <Grid item xs={5} style={{ padding: '10px' }}>
          <Box textAlign="left" paddingBottom="5px" fontWeight="fontWeightBold">
            Columns
          </Box>
          <DropdownSelect
            options={columnOptions}
            isMulti={true}
            selectedValues={selectedColumnValues}
            onSelectionChange={handleColumnSelectionChange}
          />
        </Grid>
        <Grid item xs={2} style={{ padding: '35px 10px 0px', textAlign: 'right' }}>
          <Button
            disabled={selectedColumnValues.length < 1 && selectedTableValues.length < 1}
            variant='contained'
            onClick={handleViewButtonClick}
          >
            View
          </Button>
          &nbsp;
          <Button
            disabled={selectedColumnValues.length < 1 && selectedTableValues.length < 1}
            variant='contained'
            onClick={handleValidateButtonClick}
          >
            Validate
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TableSelection;
