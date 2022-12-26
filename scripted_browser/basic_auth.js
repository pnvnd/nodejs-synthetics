// Chrome 100 go to website with basic authentication and validate text "true" exists. 
// Username is "foo", password is "bar" in this case
$webDriver.get('http://' + $secure.EXAMPLE_USER + ':' + $secure.EXAMPLE_PASS + '@' + 'httpbin.org/basic-auth/foo/bar')
    .then(function(){$webDriver.findElement($selenium.By.xpath("//*[contains(text(), 'true')]"));
});