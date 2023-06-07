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

// Function to list bucket names and retrieve bucket lifecycle rules
function listBucketsAndLifecycleRules() {
  s3.listBuckets(function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      var bucketNames = data.Buckets.map(bucket => bucket.Name);
      // console.log(bucketNames);

      // Get lifecycle rules for each bucket
      for (var bucketName of bucketNames) {
        getBucketLifecycleRules(bucketName);
      }
    }
  });
}

// Function to get bucket lifecycle rules
function getBucketLifecycleRules(bucketName) {
  s3.getBucketLifecycle({Bucket: bucketName}, function(err, data) {
    if (err) {
      console.log(bucketName, err.code);
    } else {
      console.log(`${bucketName} is okay.`);
    };
    assert.ok(data);
  });
}

// Call the function to list bucket names and retrieve lifecycle rules
listBucketsAndLifecycleRules();

