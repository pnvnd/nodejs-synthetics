let $secure = process.env; // comment out when testing in New Relic
var assert = require('assert');

var got = require('got');
var nodemailer = require('nodemailer');

var GRAPH_API = 'https://api.newrelic.com/graphql';
var HEADERS = { 'Content-Type': 'application/json', 'API-Key': $secure.NEW_RELIC_USER_KEY };
var ACCOUNT_ID = $secure.ACCOUNT_ID;

// https://docs.newrelic.com/docs/apis/nerdgraph/examples/export-dashboards-pdfpng-using-api/#dash-multiple
var guid = `MzI5MzE1N3xWSVp8REFTSEJPQVJEfDUzODQ4ODc`;

var query = `mutation {
  dashboardCreateSnapshotUrl(guid: "${guid}")
}`;

var emailTemplate = `<!doctype html>
<html class="no-js" lang="">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
  <main>
    <h1>Weekly Report</h1>
    <p>
        Attached is a New Relic Monitoring Report for
        <strong>DATACRUNCH</strong> and account id
        <strong>${ACCOUNT_ID}</strong>.
    </p>
  </main>
</body>

</html>
`

var opts = {
  url: GRAPH_API,
  headers: HEADERS,
  json: { 'query': query, 'variables': {} }
};

async function sendReport() {
  let resp = await got.post(opts);

  if (resp.statusCode == 200) {
    let payload = JSON.parse(resp.body);
    let attachment = payload.data.dashboardCreateSnapshotUrl;
    //console.log(attachment);

    let transporter = nodemailer.createTransport({
      host: "smtp.netfirms.com",
      port: 465,
      auth: {
          user: "peter@datacrunch.ca",
          pass: $secure.EMAIL_PASSWORD
    }
    });

    var reportDate = new Date(); 
    var date = reportDate.getFullYear()+'_'+(reportDate.getMonth()+1)+'_'+reportDate.getDate();
    
    var message = {
      from: 'peter@datacrunch.ca',
      to: 'peternguyen@newrelic.com, info@datacrunch.ca',
      subject: 'Test message from New Relic Synthetic monitor',
      //text: 'Testing the nodemailer package.',
      html: emailTemplate,
      attachments: [{
        filename: date + '-dashboard.pdf',
        path: attachment
      }]
    };

    transporter.sendMail(message, function(err, info, response){
      assert.ok(!err, "Error sending email: "+err)
    });
  
  }
  else {
    console.log(resp.body);
    return 'failed';
  };
};

sendReport();