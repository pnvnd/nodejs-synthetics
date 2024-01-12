const By = $selenium.By;
const until = $selenium.until;

$webDriver.get("https://www.datacrunch.ca/")
  .then(function(){ return $webDriver.wait(until.elementLocated(By.tagName("html")), 2000) })
  .then(function(){ return $webDriver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Tutorials')]")), 2000) })