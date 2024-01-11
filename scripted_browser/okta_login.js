// Chrome 100 Runtime
let $secure = process.env; // comment out when testing in New Relic
let $selenium = require('selenium-webdriver');
let $webDriver = new $selenium.Builder().forBrowser('chrome').build();
const By = $selenium.By;

$webDriver.get("https://example.okta.com")
  // Wait 10 seconds for the page to load and get the <title>
  .then(function(){ $webDriver.wait(function() { return $webDriver.getTitle().then(function(title) { return title === "Example Developer Corp (Production) - Sign In" }) }, 10000);})
  // Wait 5 seconds, then find the username field and type in the username
  .then(function(){ return $webDriver.findElement(By.name("okta-signin-username"), 5000).sendKeys($secure.EXAMPLE_USER);})
  // Wait 30 seconds, then find the password field (named "input62" in this case) and type in the password
  .then(function(){ return $webDriver.findElement(By.name("okta-signin-password"), 5000).sendKeys($secure.EXAMPLE_PASS);})
  // Wait 30 seconds, then click the "Verify" button
  .then(function(){ return $webDriver.findElement(By.name("okta-signin-submit"), 5000).click();})
  // Wait 20 seconds, then find text string in page body "Unable to sign in"
  .then(function(){ return $webDriver.findElement(By.xpath("//*[contains(text(), 'Unable to sign in')]"), 5000) })
