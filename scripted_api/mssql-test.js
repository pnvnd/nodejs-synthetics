const sql = require('mssql');
const { promisify } = require('util');
const { json } = require('body-parser');

async function main() {
  try {
    // Create a SQL Server connection pool
    await sql.connect({
      server: 'mssqlserver.xxxxxxxxxxxx.ca-central-1.rds.amazonaws.com',
      user: 'admin',
      password: 'xxxxxxxxxxxx',
      database: 'pubs'
    });

    // Execute a SELECT statement
    const result = await sql.query`SELECT TOP 10 emp_id, fname, minit, lname, job_id, job_lvl, pub_id FROM employee`;

    // Convert the query results to a JSON object
    const jsonResult = JSON.stringify(result.recordset);

    // Print the JSON object
    console.log(jsonResult);
  } catch (err) {
    console.error(err);
  } finally {
    // Close the SQL Server connection pool
    await sql.close();
  }
}

main();