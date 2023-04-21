import pymssql
import json

# Connect to the SQL Server database
cnxn = pymssql.connect(
    server='mssqlserver.xxxxxxxxxxxx.ca-central-1.rds.amazonaws.com',
    user='admin',
    password='xxxxxxxxxxxx',
    database='pubs'
)

# Create a cursor object
cursor = cnxn.cursor()

# Execute a SELECT statement
cursor.execute('''
    SELECT TOP 10 
        emp_id, fname, minit, lname, job_id, job_lvl, pub_id 
    FROM
        employee
''')

# Fetch the results
rows = cursor.fetchall()

# Convert the query results to a list of dictionaries
results = []
for row in rows:
    result = {}
    for i, col in enumerate(cursor.description):
        result[col[0]] = row[i]
    results.append(result)

# Convert the results to a JSON object
json_results = json.dumps(results)

# Print the JSON object
print(json_results)

# Close the cursor and connection
cursor.close()
cnxn.close()
