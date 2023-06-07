let $secure = process.env; // comment out when testing in New Relic
var assert = require("assert")

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Create S3 service object
var s3 = new AWS.S3(
  {
    apiVersion: '2006-03-01',
    region: 'ca-central-1',
    accessKeyId: $secure.AWS_ACCESS_KEY_ID,
    secretAccessKey: $secure.AWS_SECRET_ACCESS_KEY
  }
);

/* The following example gets ACL on the specified bucket. */
var params = {
  Bucket: "datacrunch.ca"
 };

s3.getBucketLifecycle(params, function(err, data) {
  assert.ok(data);
  if (err) console.log(err.code);
  else console.log(data.Rules);
});