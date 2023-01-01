/* Create secure credentials in New Relic and replace "process.env.XXX" with "$secure.XXX" */
const got = require('got');

const projectId = "data-yryso";
var endpoint = `https://data.mongodb-api.com/app/${projectId}/endpoint/data/v1/action/find`;

var headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'Api-Key': process.env.MONGODB_ATLAS_API_KEY,
  'Accept': 'application/json'
};

var data = {
  "dataSource": "Cluster0", 
  "database": "sample_supplies", 
  "collection": "sales", 
  "filter": {
    "saleDate": {
      "$gte": { "$date": { "$numberLong": (Date.now()-86400000).toString() } }, // Check 24 hours ago
      "$lt": { "$date": { "$numberLong": (Date.now()).toString() } } // Until now
    }
  }, 
  "sort": {"saleDate": -1}, 
  //"limit": 3
};

var opts = {
  url: endpoint,
  headers: headers,
  json: data
};

(async () => {
  try {
    let response = await got.post(opts);
    let payload = JSON.parse(response.body);
    
    for (let i=0; i < payload.documents.length; i++) {
      //payload.documents[i]["customLogAttribute"] = "MongoDbAtlasCustomSample"
      payload.documents[i]["eventType"] = "MongoDbAtlasCustomSample"
    }

    console.log(payload.documents);

    var account_id = process.env.ACCOUNT_ID;

    got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
    // got.post('https://log-api.newrelic.com/log/v1', {
      headers: {
        'Api-Key': process.env.NEW_RELIC_LICENSE_KEY,
        'Content-Type': 'application/json'
      },
      json: payload.documents
    });
    
  } catch (error) {
    console.log(error.response.body);
  }
})();
