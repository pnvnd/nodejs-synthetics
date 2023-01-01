/* Create secure credentials in New Relic and replace "process.env.XXX" with "$secure.XXX" */
const got = require('got');
const crypto = require('crypto');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');

// You can use https://www.base64encode.net to decode RSA private keys.
// If string is too long, split into multiple parts
const buff = new Buffer.from(process.env.SNOWFLAKE_PRIVATE_KEY_1A + process.env.SNOWFLAKE_PRIVATE_KEY_1B, 'base64');

// New Relic supports secure credentials up to 10000 characters
// const buff = new Buffer.from($secure.SNOWFLAKE_PRIVATE_KEY, 'base64'); 
const privateKeyFile = buff.toString("utf-8");

/* Alternatively, paste the entire private key in the script
const privateKeyFile = `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFHDBOBgkqhkiG9w0BBQ0wQTApBgkqhkiG9w0BBQwwHAQIS6AhT/z/oEcCAggA
...
7w8qLnN52lcZTeMwmUyD7w==
-----END ENCRYPTED PRIVATE KEY-----`;
*/

const mypassphrase = process.env.SNOWFLAKE_PASSPHRASE;   // use synthetic secure credential here
const account_identifier = "fjwfggy-ys51852";
const user = "DATACRUNCH";
const qualified_username = account_identifier.toUpperCase() + "." + user;

privateKeyObject = crypto.createPrivateKey({ key: privateKeyFile, format: 'pem', passphrase: mypassphrase });
var privateKey = privateKeyObject.export({ format: 'pem', type: 'pkcs8' });

publicKeyObject = crypto.createPublicKey({ key: privateKey, format: 'pem' });
var publicKey = publicKeyObject.export({ format: 'der', type: 'spki' });
var publicKeyFingerprint = 'SHA256:' + crypto.createHash('sha256') .update(publicKey, 'utf8') .digest('base64');

const jwtheader = {"alg": "RS256",  "typ": "JWT"};
const jwtclaimset = {
  "iss": qualified_username+ '.' + publicKeyFingerprint,
  "sub": qualified_username,
  "exp": Math.floor(Date.now() / 1000) + (60 * 60),
  "iat": Math.floor(Date.now() / 1000)
};

// Encode the header and payload as base64 strings
const encodedJwtHeader = new Buffer.from(JSON.stringify(jwtheader), "utf-8").toString('base64');
const encodedJwtClaimset = new Buffer.from(JSON.stringify(jwtclaimset), "utf-8").toString('base64');
var unsignedJwt = encodedJwtHeader + '.' + encodedJwtClaimset;

const encodedSignature = crypto.createSign('RSA-SHA256').update(unsignedJwt).sign(privateKey, 'base64');
const jwt = encodedJwtHeader + '.' + encodedJwtClaimset + '.' + encodedSignature;

// console.log(jwt);

var snowflake_sql=`select OBJECT_CONSTRUCT_KEEP_NULL('eventType', 'SnowflakeAccount',
  'CREDITS_USED_COMPUTE_AVERAGE', avg(CREDITS_USED_COMPUTE), 
  'CREDITS_USED_COMPUTE_SUM', sum(CREDITS_USED_COMPUTE),
  'CREDITS_USED_CLOUD_SERVICES_AVERAGE', avg(CREDITS_USED_CLOUD_SERVICES), 
  'CREDITS_USED_CLOUD_SERVICES_SUM', sum(CREDITS_USED_CLOUD_SERVICES), 
  'CREDITS_USED_AVERAGE', avg(CREDITS_USED), 
  'CREDITS_USED_SUM', sum(CREDITS_USED)
) as json_result
from METERING_HISTORY
where start_time >= date_trunc(day, current_date)`;

var opts = {
  url: `https://${account_identifier}.snowflakecomputing.com/api/v2/statements`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + jwt,
    'Accept': 'application/json',
    'User-Agent': 'myApplicationName/1.0',
    'X-Snowflake-Authorization-Token-Type': 'KEYPAIR_JWT'
  },
  json: {
    "statement": snowflake_sql,
    "timeout": 60,
    "database": "SNOWFLAKE",
    "schema": "ACCOUNT_USAGE",
    "warehouse": "COMPUTE_WH",
    "role": "ACCOUNTADMIN"
  }
};

async function getSnowflakeAccount() {
  let resp = await got.post(opts);

  if (resp.statusCode == 200) {
    let payload = JSON.parse(resp.body);
    
    console.log(payload.data[0][0]);

    var account_id = process.env.ACCOUNT_ID;

    got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
    headers: {
      'Api-Key': process.env.NEW_RELIC_LICENSE_KEY,
      'Content-Type': 'application/json'
    },
    json: JSON.parse(payload.data[0][0])
    });
  }
  else {
    console.log(resp.body);
    return 'failed';
  };
};

getSnowflakeAccount();