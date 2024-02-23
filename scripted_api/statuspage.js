const got = require('got');
const statuspage = 'status.newrelic.com'

const account_id = $secure.ACCOUNT_ID
const ingest_key = $secure.INGEST_KEY

async function getStatusPage() {
  const url = `https://${statuspage}/api/v2/summary.json`; 
  let resp = await got(url);

  if (resp.statusCode == 200) {
    let data = JSON.parse(resp.body);
    for (let i=0; i < data.components.length; i++) {
      data.components[i]["eventType"] = "StatusPageSample"
      data.components[i]["statuspage"] = `${statuspage}`
    }
    //console.log(data.components);

    got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
      headers: {
        'Api-Key': `${ingest_key}`,
        'Content-Type': 'application/json'
      },
      json: data.components
    });
  }
    
  else {
    console.log(resp.body);
  };
};

getStatusPage()