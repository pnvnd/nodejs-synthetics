const got = require('got');

var account_id = '#######'
var endpoint = 'https://data.mongodb-api.com/app/xxxxxxx/endpoint/data/v1/action/find';
var headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'Api-Key': $secure.MONGODB_ATLAS_API_KEY,
  'Accept': 'application/json'
}

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
    
    // got.post('https://log-api.newrelic.com/log/v1', {
    got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
      headers: {
        'Api-Key': $secure.INGEST_KEY,
        'Content-Type': 'application/json'
      },
      json: payload.documents
    });
    
  } catch (error) {
    console.log(error.response.body);
  }
})();
