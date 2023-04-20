let $secure = process.env; // comment out when testing in New Relic

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'ca-central-1'});

rds = new AWS.RDS({apiVersion: '2014-10-31'});

  var params = {
    resourceArn: 'STRING_VALUE', /* required */
    secretArn: 'STRING_VALUE', /* required */
    sql: 'STRING_VALUE', /* required */
    continueAfterTimeout: true || false,
    database: 'STRING_VALUE',
    formatRecordsAs: NONE | JSON,
    includeResultMetadata: true || false,
    parameters: [
      {
        name: 'STRING_VALUE',
        typeHint: JSON | UUID | TIMESTAMP | DATE | TIME | DECIMAL,
        value: {
          arrayValue: { /* ArrayValue */
            arrayValues: [
              /* recursive ArrayValue */,
              /* more items */
            ],
            booleanValues: [
              true || false,
              /* more items */
            ],
            doubleValues: [
              'NUMBER_VALUE',
              /* more items */
            ],
            longValues: [
              'NUMBER_VALUE',
              /* more items */
            ],
            stringValues: [
              'STRING_VALUE',
              /* more items */
            ]
          },
          blobValue: Buffer.from('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
          booleanValue: true || false,
          doubleValue: 'NUMBER_VALUE',
          isNull: true || false,
          longValue: 'NUMBER_VALUE',
          stringValue: 'STRING_VALUE'
        }
      },
      /* more items */
    ],
    resultSetOptions: {
      decimalReturnType: STRING | DOUBLE_OR_LONG,
      longReturnType: STRING | LONG
    },
    schema: 'STRING_VALUE',
    transactionId: 'STRING_VALUE'
  };
  rdsdataservice.executeStatement(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });