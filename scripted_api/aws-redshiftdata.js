let $secure = process.env; // comment out when testing in New Relic
var got = require('got');
var AWS = require('aws-sdk');

// Create RedshiftData service object
var redshiftdata = new AWS.RedshiftData(
  {
    apiVersion: '2019-12-20',
    region: 'ca-central-1',
    accessKeyId: $secure.AWS_ACCESS_KEY_ID,
    secretAccessKey: $secure.AWS_SECRET_ACCESS_KEY
  }
);

var redshiftDbName = 'datacrunch';
var sqlQuery = 'SELECT * FROM Table'

var params = {
    Database: `${redshiftDbName}`, /* required */
    Sql: `${sqlQuery}`, /* required */
    ClientToken: 'STRING_VALUE',
    ClusterIdentifier: 'STRING_VALUE',
    DbUser: 'STRING_VALUE',
    SecretArn: 'STRING_VALUE',
    StatementName: 'STRING_VALUE',
    WorkgroupName: 'STRING_VALUE'
  };

// Function to list all bucket names and retrieve bucket details
async function getRedshiftData() {
    redshiftdata.executeStatement(params, function(err, data) {
      if (err) {
        var payload = {
          "code": err.code,
          "__type": err.__type,
          "message": err.message,
          "region": err.region,
          "time": err.time,
          "requestId": err.requestId,
          "statusCode": err.statusCode,
          "retryable": err.retryable,
          "retryDelay": err.retryDelay
        };
      }
      else {
        var payload = data;
      }
      // Add New Relic metadata to payload
      payload["eventType"] = "RedshiftCustomSample";
      payload["redshiftDbName"] = `${redshiftDbName}`;
      payload["sqlQuery"] = `${sqlQuery}`;
      console.log(payload);
  
    //   var account_id = $secure.ACCOUNT_ID;
    //   got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
    //     headers: {
    //       'Api-Key': $secure.NEW_RELIC_LICENSE_KEY,
    //       'Content-Type': 'application/json'
    //     },
    //     json: payload
  
    //  })
    })
  }
  
  getRedshiftData();