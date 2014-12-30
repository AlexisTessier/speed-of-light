Speed Of Light
--------------

####About

Speed Of Light allows you to easily run some basic performance tests in javascript. _(What kind of loop is the fastest ? Is this implementation faster than this other ?)_

####How to install

	npm install speedoflight

####How to use

	var SpeedOfLight = require('speedoflight');

	SpeedOfLight({
		name : "Test, compare two ways to do a thing",
		timesToRun : 1000,
		test : {
			"The first way" : function(test) {
				//init here all you need in the loop

				while(test.loop()){
					//Do the thing
				}
			},
			"The second way" : function(test) {
				//init here all you need in the loop

				while(test.loop()){
					//Do the thing, but differently
				}
			}
		}
	}).run().order();

####Documentation

**SpeedOfLight(params)** returns an soltest object which can run defined tests.

-	**params.name** is a string to describe the thing to do

-	**params.timesToRun** is a integer which multiply the number of times that a basic loop runs (10000).

-	**params.test** is an object containing the differents ways to achieve the thing to do. Each key have to be a string naming the way used, and must contain a test function.

A test function take in arguments one object with a loop() method which just increase a counter. When the counter is greater than **timesToRun * 10000**, the loop method returns false.

**soltest.run(showlog)** run all your test functions and calculate the execution time for each.

-	**showlog** if false, you don't see on console the results of test

**soltest.order(showlog)** calculate the execution time for each of your test function and tell you which are the faster.

-	**showlog** if false, you don't see on console the results of test

_See examples if you need more explanations_