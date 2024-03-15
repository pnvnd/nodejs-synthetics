const got = require('got');
const statuspage = 'status.statuscast.com'

const account_id = $secure.ACCOUNT_ID
const ingest_key = $secure.INGEST_KEY

async function getStatusPage() {
  const url = `https://${statuspage}/api/v4/components`; 
  let resp = await got(url);

  if (resp.statusCode == 200) {
    let data = JSON.parse(resp.body);
    for (let i=0; i < data.length; i++) {
      data[i]["eventType"] = "StatusCastSample"
      data[i]["statuspage"] = `${statuspage}`
    }
    console.log(data);

    got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
      headers: {
        'Api-Key': `${ingest_key}`,
        'Content-Type': 'application/json'
      },
      json: data
    });
  }
    
  else {
    console.log(resp.body);
  };
};

getStatusPage()