let $secure = process.env; // comment out when testing in New Relic

const got = require('got');
const statuspage = 'led-zeppelin'

const account_id = $secure.ACCOUNT_ID
const ingest_key = $secure.INGEST_KEY

async function getStatusPage() {
  const url = `https://status.incident.io/proxy/${statuspage}`; 
  let resp = await got(url);

  if (resp.statusCode == 200) {
    let data = JSON.parse(resp.body);

    // Create a map for quick lookup of affected components by component_id
    let affectedComponentsMap = {};
    for (let affected of data.summary.affected_components) {
      affectedComponentsMap[affected.component_id] = affected.status;
    }

    // Update components with status if they are affected
    for (let component of data.summary.components) {
      component["eventType"] = "IncidentIOSample";
      component["statuspage"] = `${statuspage}`;
      component["status"] = affectedComponentsMap[component.id] || "operational";
    }

    got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
        headers: {
          'Api-Key': `${ingest_key}`,
          'Content-Type': 'application/json'
        },
        json: data.summary.components
      });

      console.log(data.summary.components)

  } else {
    console.log(resp.body);
  }
};

getStatusPage();