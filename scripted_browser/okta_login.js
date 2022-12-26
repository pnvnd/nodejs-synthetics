// Chrome 100 Runtime
$webDriver.get("https://example.okta.com")
  // Wait 1- seconds for the page to load and get the <title>
  .then(function(){ $webDriver.wait(function() { return $webDriver.getTitle().then(function(title) { return title === "MassMutual Financial Group - Sign In" }) }, 10000);})
  // Wait 5 seconds, then find the username field and type in the username
  .then(function(){ return $webDriver.findElement($selenium.By.name("identifier"), 5000).sendKeys($secure.EXAMPLE_USER);})
  // Wait 5 seconds, then click the "Next" button
  .then(function(){ return $webDriver.findElement($selenium.By.xpath("//input[@value='Next']"), 5000).click();})
  // Wait 30 seconds, then find the password field (named "input62" in this case) and type in the password
  .then(function(){ return $webDriver.findElement($selenium.By.id("input62"), 30000).sendKeys($secure.EXAMPLE_PASS);})
  // Wait 30 seconds, then click the "Verify" button
  .then(function(){ return $webDriver.findElement($selenium.By.xpath("//input[@value='Verify']"), 30000).click();})
  // Wait 20 seconds, then find text string in page body "Unable to sign in"
  .then(function(){ return $webDriver.findElement($selenium.By.xpath("//*[contains(text(), 'Unable to sign in')]"), 20000) })
