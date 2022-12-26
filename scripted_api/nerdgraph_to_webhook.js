// Node 16.10.0 Runtime
var got = require('got');

var GRAPH_API = 'https://api.newrelic.com/graphql';
var HEADERS = { 'Content-Type': 'application/json', 'Api-Key': $secure.USER_KEY };
var ACCOUNT_ID = $secure.ACCOUNT_ID;

var nrql = `SELECT count(*) FROM InfrastructureEvent SINCE 24 HOURS AGO FACET changeType`;

var query = `{
  actor {
    account(id: ${ACCOUNT_ID}) {
      nrql(query: "${nrql}", timeout: 90) {
       results
      }
    }
  }
}`;

var opts = {
  url: GRAPH_API,
  headers: HEADERS,
  json: { 'query': query, 'variables': {} }
};

let resp = await got.post(opts);

if (resp.statusCode == 200) {
  let test = JSON.parse(resp.body);
  let alert = "ChangeType, Count\n";
  for (var i=0; i<Object.keys(test.data.actor.account.nrql.results).length; i++){
    alert = alert + test.data.actor.account.nrql.results[i].changeType + ", " + test.data.actor.account.nrql.results[i].count + "\n"
  };
  got.post($secure.WEBHOOK_GOOGLECHAT, { json: {"text": alert} });
}
else {
  console.log(resp.body);
  return 'failed';
};
