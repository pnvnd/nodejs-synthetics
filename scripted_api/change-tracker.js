let $secure = process.env; // comment out when testing in New Relic
var got = require('got');

var GRAPH_API = 'https://api.newrelic.com/graphql';
var HEADERS = { 'Content-Type': 'application/json', 'API-Key': $secure.NEW_RELIC_USER_KEY };

// Example, this entity is for my "Chargeback" Synthetics Monitor
var guid = `MzI5MzE1N3xTWU5USHxNT05JVE9SfDAzMzBiNWU5LTgyNzgtNDliYy05N2UyLTBlZGU1ZWE2OTc4Mw`;

// deploymentType can be: BASIC, BLUE_GREEN, CANARY, OTHER, ROLLING, SHADOW
var query = `mutation {
    changeTrackingCreateDeployment(deployment: {
      changelog: "Python deployment", 
      commit: "123456c", 
      deepLink: "https://github.com/pnvnd", 
      deploymentType: BASIC, 
      description: "Testing node.js change tracking", 
      entityGuid: "${guid}", 
      groupId: "123", 
      user: "peternguyen@newrelic.com", 
      version: "0.1.8"
    }) {
      changelog
      commit
      deepLink
      deploymentId
      deploymentType
      description
      groupId
      user
    }
  }`;

var opts = {
  url: GRAPH_API,
  headers: HEADERS,
  json: { 'query': query }
};

async function createDeployment() {
  let resp = await got.post(opts);
    if (resp.statusCode == 200) {
      let payload = JSON.parse(resp.body);
      console.log(payload.data.changeTrackingCreateDeployment);
    
    }
    else {
      console.log(resp.body);
      return 'failed';
    };
};

createDeployment();