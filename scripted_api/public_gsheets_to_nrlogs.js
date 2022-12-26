var got = require('got');

const sheetID = '1XxiE5T575Twn4enEfwSz1wTnjg6CC71F6b3ZpTzD6xo';
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = 'Sheet1';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;
const data = [];

let resp = await got(url);

if (resp.statusCode == 200) {
  const jsData = JSON.parse(resp.body.substr(47).slice(0,-2));
  //console.log(jsData);
  
  const colz = [];
  jsData.table.cols.forEach((heading)=>{
    if(heading.label) {
      colz.push(heading.label.toLowerCase().replace(/\s/g,''));
    }
  });

  jsData.table.rows.forEach((main)=>{
    //console.log(main);
    const row = {};
    colz.forEach((ele,ind)=>{
      //console.log(ele);
      row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
    })
    data.push(row);
  });
  
  //console.log(data[1].firstname);
  got.post('https://log-api.newrelic.com/log/v1', {
      headers: {
        'Api-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXNRAL',
        'Content-Type': 'application/json'
      },
      json: data
    });
}
else {
  console.log(resp.body);
  return 'failed';
};