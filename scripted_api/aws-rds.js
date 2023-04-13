let $secure = process.env; // comment out when testing in New Relic

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'ca-central-1'});

// Create RDS service object
// s3 = new AWS.S3({apiVersion: '2006-03-01'});
rds = new AWS.RDS({apiVersion: '2014-10-31'});

// Call S3 to list the buckets
// s3.listBuckets(function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.Buckets);
//   }
// });

rds.deregisterDBProxyTargets(function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });