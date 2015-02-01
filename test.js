'use strict';

var must = require("must");
var SOL = require('./index');

describe('Speed of light (SOL)', function() {
	describe('Is a function', function() {
		it('SOL must be a function', function() {
			SOL.must.be.a.function();
		});

		var counter = 0, test = SOL(), test2 = SOL.performance.test(), runReturn, orderReturn, runner, timeScaleRunner, test3 = SOL.benchmark({
			about : "Test for mocha",
			implementations : {
				"get the runner" : function(test) {
					runner = test;
				}
			}
		}), subtest, finalTimesToRun, test4 = SOL({
			timesToRun : 50000,
			implementations : {
				"just assign" : function(test){
					var assign = 8, toAssign = 5, toAssign2 = 2;

					while(test.loop()){
						assign = test.current %2 === 0 ? toAssign : toAssign2;
					}
				},
				"string compare with number" : function(test) {
					var equal, string = "568123", number = 5102777;

					while(test.loop()){
						equal = string == number;
					}
				},
				"string compare with number strict" : function(test) {
					var equal, string = "568123", number = 5102777;

					while(test.loop()){
						equal = string === number;
					}
				},
				"iteration" : function(test) {
					var iteration = 0;

					while(test.loop()){
						iteration++;
					}
				}
			}
		}), test5 = SOL.benchmark({
			about : "Test for mocha 2",
			timeScale : 5000,
			implementations : {
				"get the runner for timeScale" : function(test) {
					timeScaleRunner = test;
				}
			}
		});	

		describe('Whatever the params, returns a test object', function() {
			it('Test object is object with run and order methods', function() {
				test.must.be.an.object();
				test.run.must.be.a.function();
				test.order.must.be.a.function();

				test2.must.be.an.object();
				test2.run.must.be.a.function();
				test2.order.must.be.a.function();

				test3.must.be.an.object();
				test3.run.must.be.a.function();
				test3.order.must.be.a.function();

				test4.must.be.an.object();
				test4.run.must.be.a.function();
				test4.order.must.be.a.function();

				test5.must.be.an.object();
				test5.run.must.be.a.function();
				test5.order.must.be.a.function();
			});

			it('Test object have an unique string as name', function() {
				test.must.have.ownProperty("name");
				test.name.must.be.a.string();

				test2.must.have.ownProperty("name");
				test2.name.must.be.a.string();

				test.name.must.not.be.equal(test2.name);

				test3.must.have.ownProperty("name");
				test3.name.must.be.a.string();
				test3.name.must.be.equal("Test for mocha");

				test4.must.have.ownProperty("name");
				test4.name.must.be.a.string();

				test5.must.have.ownProperty("name");
				test5.name.must.be.a.string();
				test3.name.must.be.equal("Test for mocha");
			});

			it('Test object start with a boolean yetRunned at false', function() {
				test.must.have.ownProperty("yetRunned", false);
				test.yetRunned.must.be.boolean();
				test.yetRunned.must.be.equal(false);

				test2.must.have.ownProperty("yetRunned", false);
				test2.yetRunned.must.be.boolean();
				test2.yetRunned.must.be.equal(false);

				test3.must.have.ownProperty("yetRunned", false);
				test3.yetRunned.must.be.boolean();
				test3.yetRunned.must.be.equal(false);

				test4.must.have.ownProperty("yetRunned", false);
				test4.yetRunned.must.be.boolean();
				test4.yetRunned.must.be.equal(false);

				test5.must.have.ownProperty("yetRunned", false);
				test5.yetRunned.must.be.boolean();
				test5.yetRunned.must.be.equal(false);
			});

			it('Test object start with a integer timesToRun equal to default timesToRun (10000) or to defined timesToRun', function() {
				test.must.have.ownProperty("timesToRun");
				test.timesToRun.must.be.number();
				test.timesToRun.must.be.equal(parseInt(test.timesToRun, 10));

				test2.must.have.ownProperty("timesToRun");
				test2.timesToRun.must.be.number();
				test2.timesToRun.must.be.equal(parseInt(test2.timesToRun, 10));

				test3.must.have.ownProperty("timesToRun");
				test3.timesToRun.must.be.number();
				test3.timesToRun.must.be.equal(parseInt(test3.timesToRun, 10));
				test3.timesToRun.must.be.equal(parseInt((finalTimesToRun = 10000), 10));

				test4.must.have.ownProperty("timesToRun");
				test4.timesToRun.must.be.number();
				test4.timesToRun.must.be.equal(parseInt(test4.timesToRun, 10));
				test4.timesToRun.must.be.equal(50000);

				test5.must.have.ownProperty("timesToRun");
				test5.timesToRun.must.be.number();
				test5.timesToRun.must.be.equal(parseInt(test5.timesToRun, 10));
				test5.timesToRun.must.be.equal(10000);
			});

			it('Test object start with a integer timeScale equal to passed params or null', function() {
				test.must.have.ownProperty("timeScale");
				(test.timeScale === null).must.be.equal(true);

				test2.must.have.ownProperty("timeScale");
				(test2.timeScale === null).must.be.equal(true);

				test3.must.have.ownProperty("timeScale");
				(test3.timeScale === null).must.be.equal(true);

				test4.must.have.ownProperty("timeScale");
				(test4.timeScale === null).must.be.equal(true);

				test5.must.have.ownProperty("timeScale");
				test5.timeScale.must.be.number();
				test5.timeScale.must.be.equal(5000);
			});

			it('Test object have a test array containing all subtests', function() {
				test.must.have.ownProperty("test");
				test.test.must.be.an.array();
				test.test.length.must.be.equal(0);

				test2.must.have.ownProperty("test");
				test2.test.must.be.an.array();
				test2.test.length.must.be.equal(0);

				test3.must.have.ownProperty("test");
				test3.test.must.be.an.array();
				test3.test.length.must.be.equal(1);

				test4.must.have.ownProperty("test");
				test4.test.must.be.an.array();
				test4.test.length.must.be.equal(4);

				test5.must.have.ownProperty("test");
				test5.test.must.be.an.array();
				test5.test.length.must.be.equal(1);
			});

			it('A subtest must start with a name, result at null and an action', function() {
				subtest = test3.test[0];
				subtest.must.be.an.object();
				subtest.must.have.ownProperty("name", "get the runner");
				subtest.must.have.ownProperty("result", null);
				subtest.must.have.ownProperty("action");

				subtest.action.must.be.function();
			});
		});

		describe('Run and order methods must work properly', function(){
			it('Run and order methods must return the test object', function() {
				runReturn = test.run(false);
				orderReturn = test.order(false);

				runReturn.must.be.an.object();
				orderReturn.must.be.an.object();

				runReturn.run.must.be.a.function();
				orderReturn.run.must.be.a.function();

				runReturn.order.must.be.a.function();
				orderReturn.order.must.be.a.function();
			});

			it('After run, yetRunned shouldBe true', function() {
				runReturn = test2.run(false);

				runReturn.must.be.an.object();
				runReturn.yetRunned.must.be.equal(true);
			});

			it('After order, yetRunned shouldBe false', function() {
				orderReturn = test2.order(false);

				orderReturn.must.be.an.object();
				orderReturn.yetRunned.must.be.equal(false);
			});

			it('After run, result of all test must be an integer', function() {
				runReturn = test3.run(false);

				test3.must.have.ownProperty("test");
				test3.test.must.be.an.array();
				test3.test.length.must.be.equal(1);

				subtest = test3.test[0];

				subtest.must.have.ownProperty("result");
				subtest.result.must.be.a.number();
				subtest.result.must.be.equal(parseInt(subtest.result, 10));
			});

			it('After order, result of all test must be an integer and tests have to be ordered by result', function() {
				orderReturn = test4.order(false);

				test4.must.have.ownProperty("test");
				test4.test.must.be.an.array();
				test4.test.length.must.be.equal(4);

				for (var i = 0, previousResult = 0; i < test4.test.length; i++) {
					subtest = test4.test[i];

					subtest.must.have.ownProperty("result");
					subtest.result.must.be.a.number();
					subtest.result.must.be.equal(parseInt(subtest.result, 10));

					subtest.result.must.be.at.least(previousResult);

					previousResult = subtest.result;
				}
			});

			it('The runner must have a loop method which loop good time of time', function() {
				runner.must.be.an.object();
				runner.loop.must.be.a.function();

				runner.max.must.be.equal(finalTimesToRun);

				while(runner.loop()){
					counter++;
				}

				(runner.current-1).must.be.equal(runner.max);
				counter.must.be.equal(runner.max);
			});

			it('The runner with timeScale must have a loop method which loop good time of time', function() {
				test5.run(false);
				timeScaleRunner.must.be.an.object();
				timeScaleRunner.loop.must.be.a.function();

				timeScaleRunner.max.must.be.equal(5000);

				while(runner.loop()){}

				runner.current.must.be.at.least(5000);
			});
		});
	});
})