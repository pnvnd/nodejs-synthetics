let $secure = process.env; // comment out when testing in New Relic

const got = require('got');

const username = 'pnvnd'
const repository = 'nodejs-synthetics'

const account_id = $secure.ACCOUNT_ID
const ingest_key = $secure.INGEST_KEY

async function getGithubIssues() {
    const url = `https://api.github.com/repos/${username}/${repository}/issues`; 
    let resp = await got(url);
  
    if (resp.statusCode == 200) {
      let data = JSON.parse(resp.body);
      
      // Check if data is an array
      if (Array.isArray(data)) {
        // Adding "eventType" field to each item in the array
        data.forEach(issue => {
          issue["eventType"] = "GitHubIssuesSample";
        });
      } else {
        // Adding "eventType" field to the single object
        data["eventType"] = "GitHubIssuesSample";
        
        // Convert the single object to an array
        data = [data];
      }
      
      // Flatten and remove fields ending with "_url"
      data = flattenAndRemoveURLs(data);
      
      console.log(data);

      // Sending the payload to New Relic
      const response = await got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
      headers: {
        'Api-Key': `${ingest_key}`,
        'Content-Type': 'application/json'
      },
      json: data
      });
    }
      
    else {
      console.log(resp.body);
    }
  }
  
// Function to flatten and remove fields ending with "_url"
function flattenAndRemoveURLs(data) {
    const flattenedData = [];
  
    // Iterate through each object in the data array
    data.forEach(obj => {
      const flattened = {};
  
      // Recursive function to flatten nested objects
      function flatten(obj, prefix = '') {
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null && !key.endsWith('_url')) {
            if (Array.isArray(obj[key])) {
              obj[key].forEach((item, index) => {
                flatten(item, `${prefix}${key.replace(/\d+/g, '')}_`);
              });
            } else {
              flatten(obj[key], `${prefix}${key.replace(/\d+/g, '')}_`);
            }
          } else if (!key.endsWith('_url')) {
            flattened[`${prefix}${key}`] = obj[key];
          }
        }
      }
  
      flatten(obj);
      flattenedData.push(flattened);
    });
  
    return flattenedData;
  }
  
  getGithubIssues();