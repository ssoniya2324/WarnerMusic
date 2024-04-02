const snowflake = require('snowflake-sdk');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3002;

const connectionOptions = {
    account: 'XBA65735',
  username: 'Soniya_S',
  password: 'hasrjas@Gen3',
  role: 'GENAAI',
  warehouse: 'GENAI_POC',
  database: 'BET_POC',
  schema: 'WMG'
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



function executeSnowflakeQuery(sqlText) {
    return new Promise((resolve, reject) => {
        connection.execute({
            sqlText: sqlText,
            complete: (err, stmt, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        });
    });
}


// Validate Singer API

app.get('/singer', async (request, response) => {
    const sqlQuery = "SELECT album, singer, bet_poc.gen_ai.chatgpt('Predicted Singer Name for album '||album) AS Predicted_singer,case when singer=Predicted_singer then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music WHERE singer != predicted_singer and status_cd is null OR status_cd = 'F' ";
    
    executeSnowflakeQuery(sqlQuery)
        .then(result1 => {
            console.log("First query executed successfully.");
            const rowsWithIds = result1.map((row, index) => ({ id: index + 1, ...row }));
            response.json(rowsWithIds);
            const sqlQuery_1 = "INSERT OVERWRITE INTO bet_poc.wmg.test_prediction SELECT album, singer, bet_poc.gen_ai.chatgpt('Predicted Singer Name for album '||album) AS Predicted_singer, region, bet_poc.gen_ai.chatgpt('Predicted country name in shortform in three or two letters for album titled '||album) AS Predicted_region, language, bet_poc.gen_ai.chatgpt('Predicted language Name for album '||album) AS Predicted_language,case when singer=Predicted_singer and region=Predicted_region and language=Predicted_language then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music where status_cd is null OR status_cd != 'C' or status_cd != 'R';";
            return executeSnowflakeQuery(sqlQuery_1);
        })
        .then(() => {
            console.log("Second query executed in the background successfully.");
        })
        .catch(error => {
            console.error('Error executing background SQL query:', error.message);
        });
});

// Validate Region API

app.get('/region', async (request, response) => {
    const sqlQuery = "select album, singer,region, bet_poc.gen_ai.chatgpt('Predicted country name in shortform in three or two letters for album titled '||album) as Predicted_region,case when region=Predicted_region then 'P' else 'F' end as status_cd  from  bet_poc.wmg.music where region != predicted_region and status_cd is null or status_cd = 'F'";
    executeSnowflakeQuery(sqlQuery)
        .then(result1 => {
            console.log("First query executed successfully.");
            const rowsWithIds = result1.map((row, index) => ({ id: index + 1, ...row }));
            response.json(rowsWithIds);
            const sqlQuery_1 =  "INSERT OVERWRITE INTO bet_poc.wmg.test_prediction SELECT album, singer, bet_poc.gen_ai.chatgpt('Predicted Singer Name for album '||album) AS Predicted_singer, region, bet_poc.gen_ai.chatgpt('Predicted country name in shortform in three or two letters for album titled '||album) AS Predicted_region, language, bet_poc.gen_ai.chatgpt('Predicted language Name for album '||album) AS Predicted_language,case when singer=Predicted_singer and region=Predicted_region and language=Predicted_language then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music where status_cd is null OR status_cd != 'C' or status_cd != 'R';";
            return executeSnowflakeQuery(sqlQuery_1);
        })
        .then(() => {
            console.log("Second query executed in the background successfully.");
        })
        .catch(error => {
            console.error('Error executing background SQL query:', error.message);
        });
});


// Validate Language API

app.get('/language', async (request, response) => {
    const sqlQuery = "select album, singer, language,bet_poc.gen_ai.chatgpt('Predicted language Name for album '||album) as Predicted_language,case when language=Predicted_language then 'P' else 'F' end as status_cd  from  bet_poc.wmg.music where language != predicted_language and status_cd is null or status_cd = 'F'";
    
    executeSnowflakeQuery(sqlQuery)
        .then(result1 => {
            console.log("First query executed successfully.");
            const rowsWithIds = result1.map((row, index) => ({ id: index + 1, ...row }));
            response.json(rowsWithIds);
            const sqlQuery_1 =  "INSERT OVERWRITE INTO bet_poc.wmg.test_prediction SELECT album, singer, bet_poc.gen_ai.chatgpt('Predicted Singer Name for album '||album) AS Predicted_singer, region, bet_poc.gen_ai.chatgpt('Predicted country name in shortform in three or two letters for album titled '||album) AS Predicted_region, language, bet_poc.gen_ai.chatgpt('Predicted language Name for album '||album) AS Predicted_language,case when singer=Predicted_singer and region=Predicted_region and language=Predicted_language then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music where status_cd is null OR status_cd != 'C' or status_cd != 'R';";
            return executeSnowflakeQuery(sqlQuery_1);
        })
        .then(() => {
            console.log("Second query executed in the background successfully.");
        })
        .catch(error => {
            console.error('Error executing background SQL query:', error.message);
        });
});

//Base singer API
app.post('/baseData', (request, response) => {
    const {selectedAlbums} = request.body
    if (!Array.isArray(selectedAlbums)) {
        response.status(400).json({ error: 'Invalid request body format' });
        return;
    }

    const columnsToSelect = [...selectedAlbums, 'Status_cd'];
    const columnsSql = columnsToSelect.join(', ');

    const sqlQuery = `SELECT ${columnsSql} FROM bet_poc.wmg.music`;
    
    connection.execute({
        sqlText: sqlQuery,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err.message);
                response.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            console.log('Query executed successfully');
            const rowsWithIds = rows.map((row, index) => ({ id: index + 1, ...row }));
            response.json(rowsWithIds);
        }
    });
});


// Start the server
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});


app.put('/singer/update', (request, response) => {

    const {selectedAlbums} = request.body
    // Check if albumsToUpdate is provided and is an array
    if (!Array.isArray(selectedAlbums)) {
        response.status(400).json({ error: 'Invalid request body format' });
        return;
    }

    // Construct the SQL query dynamically
    const sqlQuery = `
    UPDATE bet_poc.wmg.music a
    SET singer = b.Predicted_singer,status_cd='C'
    FROM bet_poc.wmg.test_prediction b
    WHERE a.album = b.album AND
    a.album IN (${selectedAlbums.map(album => `'${album}'`).join(',')});
    `;
    
    // Execute the SQL query
    connection.execute({
        sqlText: sqlQuery,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err.message);
                response.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            console.log('Update query executed successfully');
            response.json({ message: 'Albums updated successfully' });
        }
    });
});


app.put('/region/update', (request, response) => {

    const {selectedAlbums} = request.body
    // Check if albumsToUpdate is provided and is an array
    if (!Array.isArray(selectedAlbums)) {
        response.status(400).json({ error: 'Invalid request body format' });
        return;
    }

    // Construct the SQL query dynamically
    const sqlQuery = `
    UPDATE bet_poc.wmg.music a
            SET region = b.Predicted_region,status_cd='C'
            FROM bet_poc.wmg.test_prediction b
            WHERE a.album = b.album AND
            a.album IN (${selectedAlbums.map(album => `'${album}'`).join(',')});
            `;
            
    
    // Execute the SQL query
    connection.execute({
        sqlText: sqlQuery,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err.message);
                response.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            console.log('Update query executed successfully');
            response.json({ message: 'Albums updated successfully' });
        }
    });
});


app.put('/language/update', (request, response) => {

    const {selectedAlbums} = request.body
    // Check if albumsToUpdate is provided and is an array
    if (!Array.isArray(selectedAlbums)) {
        response.status(400).json({ error: 'Invalid request body format' });
        return;
    }

    // Construct the SQL query dynamically
    const sqlQuery = `
    UPDATE bet_poc.wmg.music a
    SET language =b.Predicted_language,status_cd='C'
    FROM bet_poc.wmg.test_prediction b
    WHERE  a.album = b.album AND
    a.album IN (${selectedAlbums.map(album => `'${album}'`).join(',')});
    `;
    
    
    // Execute the SQL query
    connection.execute({
        sqlText: sqlQuery,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err.message);
                response.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            console.log('Update query executed successfully');
            response.json({ message: 'Albums updated successfully' });
        }
    });
});

app.put('/reject', async (request, response) => {
    const {selectedAlbums} = request.body;
    // Check if selectedAlbums is provided and is an array
    if (!Array.isArray(selectedAlbums)) {
        response.status(400).json({ error: 'Invalid request body format' });
        return;
    }

    const sqlQuery = `INSERT INTO bet_poc.wmg.rejected_mc SELECT album, singer, Predicted_singer, region, Predicted_region, language, Predicted_language, 'R' as status_cd FROM bet_poc.wmg.test_prediction where album IN (${selectedAlbums.map(album => `'${album}'`).join(',')});`;
    
    try {
        const result1 = await executeSnowflakeQuery(sqlQuery);
        console.log("First query executed successfully.");
        response.json({ message: 'Selected Records Rejected Successfully' });
        const sqlQuery_1 = `UPDATE bet_poc.wmg.music a SET status_cd='R' FROM bet_poc.wmg.test_prediction b WHERE a.album = b.album AND a.album IN (${selectedAlbums.map(album => `'${album}'`).join(',')});`;
        await executeSnowflakeQuery(sqlQuery_1);
        console.log('Update executed successfully. Albums updated in reject table successfully.');
    } catch (error) {
        console.error('Error executing SQL query:', error.message);

    }
});







// Define the endpoint
app.get('/getallrejected', (request, response) => {
    const sqlQuery = 'select * FROM bet_poc.wmg.rejected_mc limit 5';
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
