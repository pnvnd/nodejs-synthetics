let $secure = process.env; // comment out when testing in New Relic
var got = require('got');

var accountId = $secure.ACCOUNT_ID;

var GRAPH_API = 'https://api.newrelic.com/graphql';
var HEADERS = { 'Content-Type': 'application/json', 'Api-Key': $secure.NEW_RELIC_USER_KEY };

var nrql1 = `
SELECT 100-percentage(count(result), WHERE result !='SUCCESS') AS 'uptime'
FROM SyntheticCheck
WHERE monitorName='Chargeback Script'
SINCE YESTERDAY
`;

var nrql2 = `
SELECT 100-percentage(count(result), WHERE result !='SUCCESS') AS 'uptime'
FROM SyntheticCheck
WHERE monitorName='Chargeback Script'
SINCE YESTERDAY
`;

var nrql3 =`
SELECT 100-percentage(count(result), WHERE result !='SUCCESS') AS 'uptime'
FROM SyntheticCheck
WHERE monitorName='Chargeback Script'
SINCE YESTERDAY
`;

var query = `
query NRQL($accountId:Int!) {
  actor {
    account(id: $accountId) {
      monitor1: nrql(
        query: """${nrql1}"""
        timeout: 90
      ) {
        results
      }
      monitor2: nrql(
        query: """${nrql2}"""
        timeout: 90
      ) {
        results
      }
      monitor3: nrql(
        query: """${nrql3}"""
        timeout: 90
      ) {
        results
      }
    }
  }
}
`;

var variables = `{
  "accountId": ${accountId}
}`;

var opts = {
  url: GRAPH_API,
  headers: HEADERS,
  json: { 'query': query, 'variables': variables }
};

async function getNerdgraph() {
  let resp = await got.post(opts);
  console.log(resp.body);

  let nerdgraph = JSON.parse(resp.body);

  // Push the incident details to New Relic, comment out when testing locally.
  $util.insights.set('monitor1', nerdgraph.data.actor.account.monitor1.results[0].uptime);
  $util.insights.set('monitor2', nerdgraph.data.actor.account.monitor2.results[0].uptime);
  $util.insights.set('monitor3', nerdgraph.data.actor.account.monitor3.results[0].uptime);
  $util.insights.set('average', (nerdgraph.data.actor.account.monitor1.results[0].uptime
    +nerdgraph.data.actor.account.monitor2.results[0].uptime
    +nerdgraph.data.actor.account.monitor3.results[0].uptime)/3);

};

getNerdgraph();