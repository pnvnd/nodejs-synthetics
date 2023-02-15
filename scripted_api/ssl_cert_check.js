let $secure = process.env; // comment out when testing in New Relic
// var assert = require("assert")
var sslChecker = require("ssl-checker")

// EDIT: Put your custom URL here "example.com"
const url = 'datacrunch.ca';

// EDIT: Days before your certification expires to fail the check and provide an alert
const failDaysBeforeExpiration = 30;

sslChecker(url, 'GET', 443)
  .then(result => console.info(result));
//  .then(result => assert.ok(result.daysRemaining > failDaysBeforeExpiration, "the certificate will expire in the next " + result.daysRemaining + " days."));