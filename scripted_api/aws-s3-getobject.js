let $secure = process.env; // comment out when testing in New Relic
const got = require('got');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'ca-central-1', accessKeyId: $secure.AWS_ACCESS_KEY_ID, secretAccessKey: $secure.AWS_SECRET_ACCESS_KEY});

var account_id = $secure.ACCOUNT_ID;
var bucket = `www.datacrunch.ca`
var key = `index.html`

async function getS3Object() {
  s3.getObject({Bucket: `${bucket}`, Key: `${key}`}, function(err, data) {
    if (err) {
      var payload = {
        "message": err.message,
        "code": err.code,
        "region": err.region,
        "time": err.time,
        "requestId": err.requestId,
        "extendedRequestId": err.extendedRequestId,
        "cfId": err.cfId,
        "statusCode": err.statusCode,
        "retryable": err.retryable,
        "retryDelay": err.retryDelay
      };
    }
    else {
      var payload = data;
    }

    payload["eventType"] = "s3CustomSample";
    payload["bucketName"] = `${bucket}`;
    payload["objectName"] = `${key}`;
    console.log(payload);

    got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
      headers: {
        'Api-Key': $secure.NEW_RELIC_LICENSE_KEY,
        'Content-Type': 'application/json'
      },
      json: payload

   })
  })
}

getS3Object();