let $secure = process.env; // comment out when testing in New Relic
var got = require('got');
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

// Function to list bucket names and retrieve bucket details
function listBucketsAndBucketDetails() {
  s3.listBuckets(function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      var bucketNames = data.Buckets.map(bucket => bucket.Name);

      // Get bucket details for each bucket
      var bucketDetails = bucketNames.map(bucketName => getBucketDetails(bucketName));

      Promise.all(bucketDetails)
        .then(results => {
          console.log(results);

          var account_id = $secure.ACCOUNT_ID;

          got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
            headers: {
              'Api-Key': $secure.NEW_RELIC_LICENSE_KEY,
              'Content-Type': 'application/json'
            },
            json: results
          });
        })
        .catch(err => {
          console.log("Error retrieving bucket details:", err);
        });
    }
  });
}

// Function to get bucket details
function getBucketDetails(bucketName) {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2({ Bucket: bucketName }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        var totalSize = data.Contents.reduce((acc, obj) => acc + obj.Size, 0);
        var totalObjects = data.KeyCount;

        var bucketDetails = {
          "eventType": "s3CustomSample",
          "bucketName": bucketName,
          "bucketSizeBytes": totalSize,
          "numberOfObjects": totalObjects
        };

        resolve(bucketDetails);
      }
    });
  });
}

// Call the function to list bucket names and retrieve bucket details
listBucketsAndBucketDetails();
