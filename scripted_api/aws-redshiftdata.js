/* Reference
Create Redshift Cluster:
https://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-launch-sample-cluster.html

API Docs:
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftData.html#executeStatement-property
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftData.html#getStatementResult-property

End of Support for aws-sdk v2
https://aws.amazon.com/blogs/developer/announcing-end-of-support-for-aws-sdk-for-javascript-v2/
*/

let $secure = process.env; // comment out when testing in New Relic
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1'; // Suppress aws-sdk v2 depreciation message

var got = require('got');
var AWS = require('aws-sdk');

// Create RedshiftData service object
var redshiftdata = new AWS.RedshiftData({
    apiVersion: '2019-12-20',
    region: 'ca-central-1',
    accessKeyId: $secure.AWS_ACCESS_KEY_ID,
    secretAccessKey: $secure.AWS_SECRET_ACCESS_KEY
});

var redshiftDbName = 'sample_data_dev';
var sqlQuery = 'SELECT TOP 5 * FROM tickit.event';
var cluster = 'examplecluster';

var params = {
    Database: `${redshiftDbName}`,
    Sql: `${sqlQuery}`,
    ClusterIdentifier: `${cluster}`,
    // SecretArn: 'arn:aws:secretsmanager:<region>:<aws.accountId>:secret:redshift!<ClusterIdentifier>-<dbuser>-XXXXXX',
};

// Function to retrieve Redshift data
async function getRedshiftData() {
    try {
        const { Id } = await redshiftdata.executeStatement(params).promise();
        console.log("Statement Id:", Id);

        let seconds = 0;
        const interval = setInterval(async () => {
            seconds++;
            if (seconds > 180) {
                clearInterval(interval);
                console.log("Timeout reached. Statement is still running.");
                return;
            }
            const statementDescription = await redshiftdata.describeStatement({ Id }).promise();
            console.log(`${seconds}s: Statement Status - ${statementDescription.Status}`);
            if (statementDescription.Status === "FINISHED" && statementDescription.HasResultSet) {
                clearInterval(interval);
                const { Records, ColumnMetadata } = await redshiftdata.getStatementResult({ Id }).promise();
                const result = Records.map(record => {
                    const jsonRecord = {};
                    record.forEach((value, index) => {
                        const columnName = ColumnMetadata[index].name;
                        jsonRecord[columnName] = value.hasOwnProperty('longValue') ? value.longValue : value.stringValue;
                        // Add New Relic metadata to payload
                        jsonRecord["eventType"] = "RedshiftCustomQuerySample";
                        jsonRecord["redshiftDbName"] = `${redshiftDbName}`;
                        jsonRecord["clusterIdentifier"] = `${cluster}`;
                        jsonRecord["sqlQuery"] = `${sqlQuery}`;
                        jsonRecord["statementId"] = Id;
                    });
                    return jsonRecord;
                });

                // Calculate the size of the entire result in bytes
                const resultSizeInBytes = Buffer.byteLength(JSON.stringify(result), 'utf8');
                console.log(`Result size: ${resultSizeInBytes} bytes`);

                // Output JSON object when result size exceeds 1MB
                if (resultSizeInBytes > 1024 * 1024) {
                    console.log("Error: Result size exceeds 1MB. Reduce payload in order to send to New Relic.");
                }

                console.log(result);
                var account_id = $secure.ACCOUNT_ID;
                got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
                    headers: {
                        'Api-Key': $secure.NEW_RELIC_LICENSE_KEY,
                        'Content-Type': 'application/json'
                    },
                    json: result
                })

            } else if (statementDescription.Status === "FAILED") {
                clearInterval(interval);
                console.log("Statement execution failed.");
            }
        }, 1000); // 1 second interval
    } catch (error) {
        console.error("Error:", error);
    }
}

getRedshiftData();