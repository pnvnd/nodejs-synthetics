// Node 16.10.0 Runtime
var got = require('got');

const pageId = $secure.STATUSPAGE_PAGEID;
const url = `https://api.statuspage.io/v1/pages/${pageId}/components`; 

let resp = await got(url, {
  headers: {
    'Authorization': 'OAuth ' + $secure.STATUSPAGE_API_KEY
  }
});

if (resp.statusCode == 200) {
  let data = JSON.parse(resp.body);
  //console.log(data);
  
  got.post('https://log-api.newrelic.com/log/v1', {
      headers: {
        'Api-Key': $secure.INGEST_KEY,
        'Content-Type': 'application/json'
      },
      json: data
    });
}
else {
  console.log(resp.body);
  return 'failed';
};