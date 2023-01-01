/* Create secure credentials in New Relic and replace "process.env.XXX" with "$secure.XXX" */
var got = require('got');

const pageId = process.env.STATUSPAGE_PAGEID;
const url = `https://api.statuspage.io/v1/pages/${pageId}/components`; 

async function getStatuspage() {
  let resp = await got(url, {
    headers: {
      'Authorization': 'OAuth ' + process.env.STATUSPAGE_API_KEY
    }
  });

  if (resp.statusCode == 200) {
    let data = JSON.parse(resp.body);
    //console.log(data);
    
    got.post('https://log-api.newrelic.com/log/v1', {
        headers: {
          'Api-Key': process.env.NEW_RELIC_LICENSE_KEY,
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