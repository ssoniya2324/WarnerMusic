const snowflake = require('snowflake-sdk');
const express = require('express');
const cors = require('cors');
const async = require('async');
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


//Validate API
app.get('/getData/:columnName', async (request, response) => {
    const columnName = request.params.columnName;

    
    const sqlQuery = (columnName == 'region')? 
    `SELECT album_url, album, ${columnName}, bet_poc.gen_ai.chatgpt('Predicted Country Name for album in one name ' ||album  || coalesce(year,'')) AS proposed_region, case when ${columnName}=proposed_${columnName} then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music WHERE ${columnName} != proposed_${columnName} and status_cd is null OR status_cd = 'F'`
    : `SELECT album_url, album, ${columnName}, bet_poc.gen_ai.chatgpt('Predicted ${columnName} Name for album in one name' ||album  || coalesce(year,'')) AS proposed_${columnName}, case when ${columnName}=proposed_${columnName} then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music WHERE ${columnName} != proposed_${columnName} and status_cd is null OR status_cd = 'F'`;
    

    executeSnowflakeQuery(sqlQuery)
        .then(result1 => {
            console.log("First query executed successfully.");
            const rowsWithIds = result1.map((row, index) => ({ id: index + 1, ...row }));
            response.json(rowsWithIds);

            const sqlQuery_1 = "INSERT OVERWRITE INTO bet_poc.wmg.test_prediction SELECT album, singer, bet_poc.gen_ai.chatgpt('Predicted singer Name for album '||album) AS proposed_singer, region, bet_poc.gen_ai.chatgpt('Predicted region Name for album '||album)  AS proposed_region, language, bet_poc.gen_ai.chatgpt('Predicted language Name for album '||album) AS proposed_language,case when singer=proposed_singer and region=proposed_region and language=proposed_language then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music where status_cd is null OR status_cd != 'C' or status_cd != 'R';";
            return executeSnowflakeQuery(sqlQuery_1);
        })
        .catch(error => {
            console.error('Error executing SQL query:', error.message);
            response.status(500).send('Error executing query');
        });
});

//Base API
app.post('/baseData', (request, response) => {
    const { selectedAlbums } = request.body
    if (!Array.isArray(selectedAlbums)) {
        response.status(400).json({ error: 'Invalid request body format' });
        return;
    }

    const columnsToSelect = ['album_url' , 'year',...selectedAlbums, 'Status_cd' ];
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


// app.put('/data/update', async (request, response) => {
//     const { selectedAlbums, userInputs, columnName } = request.body;

//     // Validate inputs
//     if (!Array.isArray(selectedAlbums) || selectedAlbums.length === 0) {
//         return response.status(400).json({ error: 'selectedAlbums must be a non-empty array.' });
//     }
//     if (typeof columnName !== 'string' || columnName.trim() === '') {
//         return response.status(400).json({ error: 'columnName must be a non-empty string.' });
//     }

//     try {
//         // Validate userInputs as an object and not empty
//         if (typeof userInputs !== 'object' || Object.keys(userInputs).length === 0) {
//             return response.status(400).json({ error: 'userInputs must be a non-empty object.' });
//         }

//         const updatePromises = [];

//         // Iterate over each selected album
//         selectedAlbums.forEach(album => {
//             // Check if user input exists for the current album
//             if (userInputs.hasOwnProperty(album)) {
//                 const userInputValue = userInputs[album];
//                 const columnUpdateValue = userInputValue ? `'${userInputValue.trim()}'` : `b.proposed_${columnName}`;
//                 const sqlQuery = `
//                     UPDATE bet_poc.wmg.music a
//                     SET ${columnName} = COALESCE(${columnUpdateValue}, b.proposed_${columnName}), status_cd = 'C'
//                     FROM bet_poc.wmg.test_prediction b
//                     WHERE a.album = b.album AND a.album = '${album}';
//                 `;

//                 // Push the promise of executing the SQL query for the current album to the updatePromises array
//                 updatePromises.push(new Promise((resolve, reject) => {
//                     connection.execute({
//                         sqlText: sqlQuery,
//                         complete: (err, stmt, rows) => {
//                             if (err) {
//                                 console.error(`Error executing SQL query for album ${album}:`, err.message);
//                                 reject(err);
//                             } else {
//                                 console.log(`Update query executed successfully for album: ${album}`);
//                                 resolve();
//                             }
//                         }
//                     });
//                 }));
//             }
//         });

//         // Wait for all update queries to complete
//         await Promise.all(updatePromises);

//         response.json({ message: `Update operation successful for selected albums` });
//     } catch (error) {
//         console.error('Failed to update data:', error.message);
//         response.status(500).json({ error: 'Internal Server Error' });
//     }
// });




app.put('/data/update', async (request, response) => {
    const { selectedAlbums, userInput, columnName } = request.body;

    // Validate inputs
    if (!Array.isArray(selectedAlbums) || selectedAlbums.length === 0) {
        return response.status(400).json({ error: 'selectedAlbums must be a non-empty array.' });
    }
    if (typeof columnName !== 'string' || columnName.trim() === '') {
        return response.status(400).json({ error: 'columnName must be a non-empty string.' });
    }

    // Construct the SQL query dynamically
    const columnUpdateValue = userInput ? `'${userInput.trim()}'` : `b.proposed_${columnName}`;
    console.log(columnUpdateValue)
    const sqlQuery = `
        UPDATE bet_poc.wmg.music a
        SET ${columnName} = COALESCE(${columnUpdateValue}, b.proposed_${columnName}), status_cd = 'C'
        FROM bet_poc.wmg.test_prediction b
        WHERE a.album = b.album AND a.album IN (${selectedAlbums.map(album => `'${album}'`).join(',')});
    `;
    console.log(sqlQuery)

    try {
        // Execute the SQL query
        await connection.execute({
            sqlText: sqlQuery,
            complete: (err, stmt, rows) => {
                if (err) {
                    console.error('Error executing SQL query:', err.message);
                    return response.status(500).json({ error: 'Internal Server Error' });
                }
                console.log('Update query executed successfully');
                response.json({ message: `${columnName} data updated successfully` });
            }
        });
    } catch (error) {
        console.error('Failed to update data:', error.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});



//Reject API
app.put('/reject', async (request, response) => {
    const { selectedAlbums } = request.body;
    if (!Array.isArray(selectedAlbums)) {
        response.status(400).json({ error: 'Invalid request body format' });
        return;
    }

    const sqlQuery = `INSERT INTO bet_poc.wmg.rejected_mc SELECT album, singer, proposed_singer, region, proposed_region, language, proposed_language, 'R' as status_cd FROM bet_poc.wmg.test_prediction where album IN (${selectedAlbums.map(album => `'${album}'`).join(',')});`;

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

// Get Rejected API
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

// Get Count of the table
app.get('/getCount', (request, response) => {
    const sqlQuery = 'select count(*) from bet_poc.wmg.music';
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

// Get Corrected Count of the table
app.get('/getCorrectedCount', (request, response) => {
    const sqlQuery = "select count(*) from bet_poc.wmg.music where status_cd = 'C'";
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


// Get Rejected Count of the table
app.get('/getRejectedCount', (request, response) => {
    const sqlQuery = "select count(*) from bet_poc.wmg.music where status_cd = 'R'";
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

// Get description
app.get('/getDescription', (request, response) => {
    const sqlQuery = "describe table wmg.music";
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

app.get('/getMetrics', (request, response) => {
    const getCountQuery = 'select count(*) as total_count from bet_poc.wmg.music';
    const getCorrectedCountQuery = "select count(*) as corrected_count from bet_poc.wmg.music where status_cd = 'C'";
    const getRejectedCountQuery = "select count(*) as rejected_count from bet_poc.wmg.music where status_cd = 'R'";
    const getMismatchedCountQuery = "SELECT COUNT(*) FROM ( \
        SELECT \
            album, \
            singer, \
            bet_poc.gen_ai.chatgpt('Predicted singer Name for album ' || album) AS proposed_singer, \
            region, \
            bet_poc.gen_ai.chatgpt('Predicted region name in two or three letters for the album named ' || album) AS proposed_region, \
            language, \
            bet_poc.gen_ai.chatgpt('Predicted language Name for album ' || album) AS proposed_language \
        FROM \
            bet_poc.wmg.music \
        WHERE \
            status_cd IS NULL OR status_cd != 'C' OR status_cd != 'R' \
    ) AS subquery";
    
        const queries = [
            { key: 'total_count', query: getCountQuery },
            { key: 'corrected_count', query: getCorrectedCountQuery },
            { key: 'rejected_count', query: getRejectedCountQuery },
            { key: 'mismatched_count', query: getMismatchedCountQuery }
        ];
        
const results = {};

// Execute all queries in parallel
async.each(queries, (queryObj, callback) => {
    connection.execute({
        sqlText: queryObj.query,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err.message);
                callback(err);
            } else {
                const key = queryObj.key;
                const value = rows[0][Object.keys(rows[0])[0]]; // Extract count value
                results[key] = value;
                callback();
            }
        }
    });
}, (err) => {
    if (err) {
        response.status(500).json({ error: 'Internal Server Error' });
    } else {
        console.log('All queries executed successfully');
        response.json(results);
    }
});
});
app.put('/ingest', async (req, res) => {
    const { album, singer, region, language } = req.body;

    try {
        const query = `
        INSERT INTO bet_poc.wmg.music (album, singer, region, language, status_cd)
        VALUES (?, ?, ?, ?, null)
      `;
        const binds = [album, singer, region, language];
        await connection.execute({
            sqlText: query,
            binds: binds
        });

        res.status(200).send('Data ingested successfully');
    } catch (error) {
        console.error('Error ingesting data:', error);
        res.status(500).send('Internal server error');
    }
});




// Start the server
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});