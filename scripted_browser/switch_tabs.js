const By = $selenium.By;
const until = $selenium.until;

$webDriver.get("https://www.cochranelibrary.com")
  // Wait 1 second for the page to load and get the <title>
  .then(function(){ $webDriver.wait(function() { return $webDriver.getTitle().then(function(title) { return title === "Cochrane Reviews | Cochrane Library" }) }, 1000);})
  // Find and click on "Cochrane Reviews" and wait 1 second
  .then(function(){ return $webDriver.wait(until.elementLocated(By.linkText("Cochrane Reviews")), 1000).click(); })
  // Find and click on "Search Reviews (CDSR)"" then wait 15 seconds for the page to load
  .then(function(){ return $webDriver.wait(until.elementLocated(By.linkText("Search Reviews (CDSR)")), 15000).click(); })
  // Type "CD009330" in the search box, then press ENTER and wait 1 seconds.
  .then(function(){ return $webDriver.wait(until.elementLocated(By.id("searchText")), 1000).sendKeys("CD009330"); })
  // Click the search button and wait 5 seconds.
  .then(function(){ return $webDriver.wait(until.elementLocated(By.className("searchByBtn")), 5000).click(); })
  // Find and click on "Prolonged storage of packed red blood cells for blood transfusion" and wait 3 second
  .then(function(){ return $webDriver.wait(until.elementLocated(By.linkText("Prolonged storage of packed red blood cells for blood transfusion")), 3000).click(); })
  // Switch to the new tab that opens
  .then(function(){ return $webDriver.getAllWindowHandles(); })
  .then(function(windowHandlers) { $webDriver.switchTo().window(windowHandlers[1]); })
  // Find and click on "Download PDF" and wait 3 seconds
  .then(function(){ return $webDriver.wait(until.elementLocated(By.linkText("Download PDF")), 1000).click(); })
  // Find and click on " All content " and wait 15 seconds
  .then(function(){ return $webDriver.wait(until.elementLocated(By.className("download media pdf-link-full readcube-epdf-link")), 20000).click(); })
  // Check for the text "PDF" on the page and wait 5 seconds
  .then(function(){ return $webDriver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'PDF')]")), 10000) })
