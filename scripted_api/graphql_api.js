var assert = require("assert");
var got = require('got');

var GRAPH_API = 'https://instance.app.region.amazonaws.com/graphql';
var HEADERS = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + $secure.TOKEN };

var query = `
query GetBook($id: String!) {
  getBook(id: $id) {
    bookId
    titles
    authors
    cover
  }
}
`;

var variables = `{
  "id": "0123456789"
}`;

var opts = {
  url: GRAPH_API,
  headers: HEADERS,
  json: { 'query': query, 'variables': variables }
};

async function getNerdgraph() {
  let resp = await got.post(opts);
  console.log(resp.body);
  assert.ok(resp.statusCode == 200, resp.body);
};

getNerdgraph();