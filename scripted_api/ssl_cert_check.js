let $secure = process.env; // comment out when testing in New Relic

var assert = require("assert")
var sslChecker = require("ssl-checker")

// EDIT: Put your custom URL here "example.com"
const url = 'datacrunch.ca';

// EDIT: Days before your certification expires to fail the check and provide an alert
const failDaysBeforeExpiration = 30;

async function checkSsl() {
  let resp = await sslChecker(url, 'GET', 443);
    console.log(resp);
  
    // Push the incident details to New Relic, comment out when testing locally.
    $util.insights.set('daysRemaining', resp.daysRemaining);
    $util.insights.set('valid', resp.valid);
    $util.insights.set('validFor', resp.validFor[0]);
    $util.insights.set('validFrom', resp.validFrom);
    $util.insights.set('validTo', resp.validTo);

    // SELECT latest(custom.daysRemaining), latest(custom.valid), latest(custom.validFor), latest(custom.validFrom), latest(custom.validTo) 
    // FROM SyntheticCheck WHERE monitorName = "Monitor Name Here"

    assert.ok(resp.daysRemaining > failDaysBeforeExpiration, "The certificate will expire in the next " + resp.daysRemaining + " days.");
  };

checkSsl();