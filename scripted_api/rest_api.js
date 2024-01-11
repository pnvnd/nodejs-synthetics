var assert = require("assert");
var got = require('got');

var REST_API = 'https://environment.domain.com/v1/health';
var HEADERS = { 'Content-Type': 'application/json', 'apikey': $secure.API_KEY };

var opts = {
  url: REST_API,
  headers: HEADERS
};

async function getRestApi() {
  let resp = await got.get(opts);
  console.log(resp.body);
  assert.ok(resp.statusCode == 200, resp.body);
};

getRestApi();