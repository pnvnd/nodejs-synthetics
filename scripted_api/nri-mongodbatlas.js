/* Create secure credentials in New Relic and replace "process.env.XXX" with "$secure.XXX" */
const httpClient = require('urllib');

// Get Data from MongoDB Atlas Administration API endpoint
const publicKey = process.env.MONGODB_PUBLIC_KEY;
const privateKey = process.env.MONGODB_PRIVATE_KEY;

const groupId = '61af9740cf271d40e57e1693';
const hostName = 'cluster0-shard-00-00.tnu7n.mongodb.net:27017';
const granularity = 'PT1M';
const period = 'PT1M';
const get_uri = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${groupId}/hosts/${hostName}/fts/metrics/measurements?granularity=${granularity}&period=${period}`;

get_options = {
  method: 'GET',
  rejectUnauthorized: false,
  digestAuth: `${publicKey}:${privateKey}`,
};

httpClient.request(get_uri, get_options, function (err, data, res) {
  if (err) {
    throw err;
  }
  let payload = JSON.parse(data);
  for (let i=0; i < payload.hardwareMeasurements.length; i++) {
    payload.hardwareMeasurements[i]["eventType"] = "MongoDbAtlasSample"
  }
  // console.log(payload.hardwareMeasurements);

  // Send data from MongoDB Atlas to New Relic Event API endpoint
  const account_id = process.env.ACCOUNT_ID;
  const post_uri = `https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`;

  post_options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': process.env.NEW_RELIC_LICENSE_KEY
    },
    data: payload.hardwareMeasurements
  };

  httpClient.request(post_uri, post_options, function (err, data, res) {
    if (err) {
      throw err;
    }
    // console.log("Sent to New Relic Event API");
  });
});

