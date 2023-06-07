let $secure = process.env; // comment out when testing in New Relic

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'ca-central-1'});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    var bucketNames = data.Buckets.reduce((acc, bucket) => {
      acc.push({ Bucket: bucket.Name });
      return acc;
    }, []);
    console.log(bucketNames);
    // console.log("Success", data.Buckets);
  }
});

