// Chrome 100 runtime - go to website with basic authentication and validate text "true" exists. 
// Username is "foo", password is "bar" in this case
let $secure = process.env; // comment out when testing in New Relic
let $selenium = require('selenium-webdriver');
let $webDriver = new $selenium.Builder().forBrowser('chrome').build();

$webDriver.get('http://' + $secure.EXAMPLE_USER + ':' + $secure.EXAMPLE_PASS + '@' + 'httpbin.org/basic-auth/foo/bar')
    .then(function(){$webDriver.findElement($selenium.By.xpath("//*[contains(text(), 'true')]"));})
    .then(console.log("Login Successful!"))
;