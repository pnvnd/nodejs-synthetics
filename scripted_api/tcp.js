var assert = require('assert');

var net = require('net');

const timerstart = Date.now();

var client = net.connect({
  port: 1521,
  host: '127.0.0.1'
}, () => {
  console.log('connected to server!');
  client.destroy();
  const connectTime = Date.now() - timerstart;
  console.log('Connected in: ' + connectTime + ' ms');
//   $util.insights.set("connectTime", connectTime);
  assert.ok(connectTime < 2000, "ERROR - took longer than 2 seconds to connect. Connect time: " + connectTime);
})