let $secure = process.env; // comment out when testing in New Relic
var got = require('got');

const pageId = $secure.STATUSPAGE_PAGEID;
const url = `https://api.statuspage.io/v1/pages/${pageId}/components`; 

async function getStatuspage() {
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
          'Api-Key': $secure.NEW_RELIC_LICENSE_KEY,
          'Content-Type': 'application/json'
        },
        json: data
      });
  }
  else {
    console.log(resp.body);
    return 'failed';
  };
};

getStatuspage();