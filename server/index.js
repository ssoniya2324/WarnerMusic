const snowflake = require('snowflake-sdk');
const express = require('express');
const app = express();
app.use(express.json());

const port = 3002;

const connectionOptions = {
    account: 'deb05201.us-east-1',
    username: 'sebastian',
    password: 'Sebastian@02',
    warehouse: 'COMPUTE_WH',
    database: 'SNOWFLAKE_SAMPLE_DATA',
    schema: 'TPCDS_SF100TCL'
};

// Create the Snowflake connection
const connection = snowflake.createConnection(connectionOptions);

// Connect to Snowflake
connection.connect((err, conn) => {
    if (err) {
        console.error('Error connecting to Snowflake:', err.message);
        return;
    }
    console.log('Connected to Snowflake!');
});

// Define the endpoint
app.get('/greet', (request, response) => {
    const sqlQuery = 'select cc_call_center_id, cc_name from SNOWFLAKE_SAMPLE_DATA.TPCDS_SF100TCL.CALL_CENTER limit 5';
    connection.execute({
        sqlText: sqlQuery,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err.message);
                response.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            console.log('Query executed successfully');
            response.json(rows);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});
