Speed Of Light
--------------

⚠️ Deprecated - This module was almost never used

####About

Speed Of Light allows you to easily run some basic performance tests in javascript. _(What kind of loop is the fastest ? Is this implementation faster than this other ?)_

####About changes in version 2

The version 2 of Speedoflight does not change so much from the first version, but I've added some features and changed names of some parameters (semantic story...). So it's no compatible with previous version.

####How to install

	npm install speedoflight

####How to use

	var SpeedOfLight = require('speedoflight');

	SpeedOfLight.benchmark({
		about : "What am I going to test in this benchmark",
		timesToRun : 50000,
		//timeScale : 5000,
		implementations : {
			"The first way" : function(test) {
				//init here all you need in the loop

				while(test.loop()){
					//Do the thing
				}

				return "result to be sure that all implementations do the same thing";
			},
			"The second way" : function(test) {
				//init here all you need in the loop

				while(test.loop()){
					//Do the thing, but differently
				}

				return "result to be sure that all implementations do the same thing";
			}
		}
	}).run().order();

####Documentation

**SpeedOfLight(params)** returns a soltest object which can run defined tests.

or one of these alias (if you like semantic) :

-	**SpeedOfLight.benchmark(params)**
-	**SpeedOfLight.performance.test(params)**

-	**params.about** is a string to describe the thing to do

-	**params.timesToRun** is an integer which indicate the number of times your loops while be runned (10000 by default).

-	**params.timeScale** is an integer which indicate approximately the number of milliseconds your loops continue to run. (if used, the params timesToRun will be ignored)

-	**params.implementations** is an object containing the differents ways to achieve the thing to do. Each key have to be a string naming the way used, and must contain a test function.

A test function take in arguments one object with a loop() method which just increase a counter (by 1 or by the delta time since last call according to your use or not of timeScale params). When the counter is greater than timesToRun or timeScale, the loop method returns false.

A test function can return a value (if you want). This value will be compared (using module "deepequal") with the returned values of others test functions. You can use that feature to be sure your results are the same in all of your implementations.

**soltest.run(showlog)** run all your test functions and calculate the execution time/count for each.

-	**showlog** if false, you don't see on console the results of test

**soltest.order(showlog)** calculate the execution time for each of your test function and tell you which are the faster.

-	**showlog** if false, you don't see on console the results of test

_See examples if you need more explanations_