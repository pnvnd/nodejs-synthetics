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

// Function to list all bucket names and retrieve bucket details
async function listAllBucketsAndBucketDetails() {
  const bucketDetails = [];

  let marker = null;
  do {
    const params = { Marker: marker };
    const data = await s3.listBuckets(params).promise();

    if (data.Buckets && data.Buckets.length > 0) {
      const bucketNames = data.Buckets.map(bucket => bucket.Name);
      const bucketDetailsPromises = bucketNames.map(bucketName =>
        getBucketDetails(bucketName)
      );

      const bucketDetailsResults = await Promise.all(bucketDetailsPromises);
      bucketDetails.push(...bucketDetailsResults);
    }

    marker = data.NextMarker;
  } while (marker);

  console.log(bucketDetails);

  var account_id = $secure.ACCOUNT_ID;

  got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
    headers: {
      'Api-Key': $secure.NEW_RELIC_LICENSE_KEY,
      'Content-Type': 'application/json'
    },
    json: bucketDetails
  });

}

// Function to get bucket details
function getBucketDetails(bucketName) {
  return new Promise((resolve, reject) => {
    const params = { Bucket: bucketName };
    s3.listObjectsV2(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        const totalSize = data.Contents.reduce((acc, obj) => acc + obj.Size, 0);
        const totalObjects = data.KeyCount;

        const bucketDetails = {
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

// Call the function to list all bucket names and retrieve bucket details
listAllBucketsAndBucketDetails();