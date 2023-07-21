var got = require('got');

var GRAPH_API = 'https://api.newrelic.com/graphql';
var HEADERS = { 'Content-Type': 'application/json', 'Api-Key': $secure.USER_KEY };

// https://docs.newrelic.com/docs/apis/nerdgraph/examples/export-dashboards-pdfpng-using-api/
var guid = $secure.DASHBOARD_GUID;

var query = `mutation {
  dashboardCreateSnapshotUrl(guid: "${guid}")
}`;

var opts = {
  url: GRAPH_API,
  headers: HEADERS,
  json: { 'query': query, 'variables': {} }
};

let resp = await got.post(opts);
if (resp.statusCode == 200) {
  let payload = JSON.parse(resp.body);
  let attachment = payload.data.dashboardCreateSnapshotUrl;
  got.post($secure.WEBHOOK_GOOGLECHAT, { json: 
    {"text": "Daily New Relic Cost Report (PDF):\n" + attachment + "&width=2000\n\nDaily New Relic Cost Report (PNG):\n" + attachment.substring(0, attachment.length-3) + "PNG&width=2000"} 
  });
}
else {
  console.log(resp.body);
  return 'failed';
};
