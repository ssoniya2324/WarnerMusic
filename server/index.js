
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


//Validate API
app.get('/getData/:columnName', async (request, response) => {
    const columnName = request.params.columnName;

    const sqlQuery = `SELECT album, ${columnName}, bet_poc.gen_ai.chatgpt('Predicted ${columnName} Name for album '||album) AS Predicted_${columnName}, case when ${columnName}=Predicted_${columnName} then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music WHERE ${columnName} != Predicted_${columnName} and status_cd is null OR status_cd = 'F'`;

    executeSnowflakeQuery(sqlQuery)
        .then(result1 => {
            console.log("First query executed successfully.");
            const rowsWithIds = result1.map((row, index) => ({ id: index + 1, ...row }));
            response.json(rowsWithIds);

            const sqlQuery_1 = "INSERT OVERWRITE INTO bet_poc.wmg.test_prediction SELECT album, singer, bet_poc.gen_ai.chatgpt('Predicted singer Name for album '||album) AS Predicted_singer, region, bet_poc.gen_ai.chatgpt('Predicted region Name for album '||album)  AS Predicted_region, language, bet_poc.gen_ai.chatgpt('Predicted language Name for album '||album) AS Predicted_language,case when singer=Predicted_singer and region=Predicted_region and language=Predicted_language then 'P' else 'F' end as status_cd FROM bet_poc.wmg.music where status_cd is null OR status_cd != 'C' or status_cd != 'R';";
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


app.put('/data/update', async (request, response) => {
    const { selectedAlbums, userInputs, columnName } = request.body;

    // Validate inputs
    if (!Array.isArray(selectedAlbums) || selectedAlbums.length === 0) {
        return response.status(400).json({ error: 'selectedAlbums must be a non-empty array.' });
    }
    if (typeof columnName !== 'string' || columnName.trim() === '') {
        return response.status(400).json({ error: 'columnName must be a non-empty string.' });
    }

    try {
        // Validate userInputs as an object and not empty
        if (typeof userInputs !== 'object' || Object.keys(userInputs).length === 0) {
            return response.status(400).json({ error: 'userInputs must be a non-empty object.' });
        }

        const updatePromises = [];

        // Iterate over each selected album
        selectedAlbums.forEach(album => {
            // Check if user input exists for the current album
            if (userInputs.hasOwnProperty(album)) {
                const userInputValue = userInputs[album];
                const columnUpdateValue = userInputValue ? `'${userInputValue.trim()}'` : `b.Predicted_${columnName}`;
                const sqlQuery = `
                    UPDATE bet_poc.wmg.music a
                    SET ${columnName} = COALESCE(${columnUpdateValue}, b.Predicted_${columnName}), status_cd = 'C'
                    FROM bet_poc.wmg.test_prediction b
                    WHERE a.album = b.album AND a.album = '${album}';
                `;

                // Push the promise of executing the SQL query for the current album to the updatePromises array
                updatePromises.push(new Promise((resolve, reject) => {
                    connection.execute({
                        sqlText: sqlQuery,
                        complete: (err, stmt, rows) => {
                            if (err) {
                                console.error(`Error executing SQL query for album ${album}:`, err.message);
                                reject(err);
                            } else {
                                console.log(`Update query executed successfully for album: ${album}`);
                                resolve();
                            }
                        }
                    });
                }));
            }
        });

        // Wait for all update queries to complete
        await Promise.all(updatePromises);

        response.json({ message: `Update operation successful for selected albums` });
    } catch (error) {
        console.error('Failed to update data:', error.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});




// app.put('/data/update', async (request, response) => {
//     const { selectedAlbums, userInput, columnName } = request.body;

//     // Validate inputs
//     if (!Array.isArray(selectedAlbums) || selectedAlbums.length === 0) {
//         return response.status(400).json({ error: 'selectedAlbums must be a non-empty array.' });
//     }
//     if (typeof columnName !== 'string' || columnName.trim() === '') {
//         return response.status(400).json({ error: 'columnName must be a non-empty string.' });
//     }

//     // Construct the SQL query dynamically
//     const columnUpdateValue = userInput ? `'${userInput.trim()}'` : `b.Predicted_${columnName}`;
//     console.log(columnUpdateValue)
//     const sqlQuery = `
//         UPDATE bet_poc.wmg.music a
//         SET ${columnName} = COALESCE(${columnUpdateValue}, b.Predicted_${columnName}), status_cd = 'C'
//         FROM bet_poc.wmg.test_prediction b
//         WHERE a.album = b.album AND a.album IN (${selectedAlbums.map(album => `'${album}'`).join(',')});
//     `;
//     console.log(sqlQuery)

//     try {
//         // Execute the SQL query
//         await connection.execute({
//             sqlText: sqlQuery,
//             complete: (err, stmt, rows) => {
//                 if (err) {
//                     console.error('Error executing SQL query:', err.message);
//                     return response.status(500).json({ error: 'Internal Server Error' });
//                 }
//                 console.log('Update query executed successfully');
//                 response.json({ message: `${columnName} data updated successfully` });
//             }
//         });
//     } catch (error) {
//         console.error('Failed to update data:', error.message);
//         response.status(500).json({ error: 'Internal Server Error' });
//     }
// });



//Reject API
app.put('/reject', async (request, response) => {
    const { selectedAlbums } = request.body;
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

// Start the server
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});