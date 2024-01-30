var got = require('got');

var LOG_API = 'https://log-api.newrelic.com/log/v1';
var HEADER = { 'Content-Type': 'application/json', 'Api-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXNRAL' };

payload = {
  logType: 'custom-node',
  message: 'success',
  myId: 'b700eb94-c3c5-26c6-0497-07108b00e255',
  header: null,
  alertId: null,
  expires: 'Tue, 30 Jan 2024 23:59:59 EST',
  amount: 12345678.90
};

var opts = {
  url: LOG_API,
  headers: HEADER,
  json: { payload }
};

async function sendLogs() {
  let resp = await got.post(opts);
  console.log(resp.body);
};

sendLogs();