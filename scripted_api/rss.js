var got = require('got');
var parseString = require('xml2js').parseString;

const account_id = $secure.ACCOUNT_ID
const ingest_key = $secure.INGEST_KEY

async function getRssFeed() {
  const url = `https://azure.status.microsoft/en-us/status/feed/`; 
  let resp = await got(url);

  if (resp.statusCode == 200) {
    parseString(resp.body, function (err, result) {
      let data = { 
        eventType: "RssSample",
        title: result.rss.channel[0].item[0].title[0],
        pubDate: result.rss.channel[0].item[0].pubDate[0],
        category: result.rss.channel[0].item[0].category[0],
        link: result.rss.channel[0].item[0].link[0],
        description: result.rss.channel[0].item[0].description[0]
      };

      console.log(data);

    got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
      headers: {
        'Api-Key': `${ingest_key}`,
        'Content-Type': 'application/json'
      },
      json: data
    });
      
    });
  }
    
  else {
    console.log(resp.body);
  };
};

getRssFeed()