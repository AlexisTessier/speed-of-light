'use strict';

var _ = require('underscore');
var stringColor = require("string-color");
var uniqueSOLTestID = 0;

var errorCauseDiff = function(feature, keys) {
	errorMsg = "damn";

	console.log(errorMsg.color("red"));
};

var resultsAreTheSame = function(results) {
	_(results).each( function( result, key, results ) {
	

	});

	return true;
};

var Runner = function(max) {
	this.current = 0;
	this.max = max;
};

Runner.prototype.reset = function() {
	this.current = 0;
};

Runner.prototype.loop = function() {
	this.current++;
	return (this.current <= this.max);
};

var SOLTest = function(params) {
	var allTest, test, testName, baseTimeToRun = 10000, params = typeof params === "object" ? params : {};

	this.yetRunned = false;

	this.name = typeof params.name === "string" ? params.name : "sol_test_"+(++uniqueSOLTestID);
	this.timesToRun = typeof params.timesToRun === "number" ? baseTimeToRun*parseInt(params.timesToRun, 10) : baseTimeToRun;

	allTest = typeof params.test === "object" ? params.test : {};
	this.test = [];

	for(testName in allTest){
		test = allTest[testName];
		if (typeof test === "function") {
			this.test.push({
				name : testName,
				result : null,
				action : test
			});
		}
	}
};

SOLTest.prototype.run = function(showLog) {
	var resultsToCompare = [], i, test, start, showLog = typeof showLog === "boolean" ? showLog : true;

	if(showLog){console.log(("Running Tests : "+this.name).color("green"));}
	for(i = 0; i < this.test.length; i++){
		test = this.test[i];

		if(showLog){console.log(("\t Test : "+test.name).color("purple"));}
		start = Date.now();

		resultsToCompare.push(test.action(new Runner(this.timesToRun)));

		test.result = Date.now() - start;
		if(showLog){console.log(("\t\t time : "+test.result).color("blue"));}
	}

	this.yetRunned = true;

	this.compareResults(resultsToCompare);

	return this;
};

SOLTest.prototype.order = function(showLog) {
	var i, test, orderedResult, timeAdvantage, timeAdvantageOnLast, nextTest, inext, lastTest, showLog = typeof showLog === "boolean" ? showLog : true;
	if (!this.yetRunned) {this.run(false)};

	if(showLog){console.log(("Ordering Tests : "+this.name).color("green"));}
	if (this.test.length === 0) {
		if(showLog){console.log("\tNo test defined...".color("yellow"));}
	}
	else{
		this.test.sort(function(a, b) {
			if (a.result < b.result) {return -1};

			if (a.result > b.result) {return 1};

			return 0;
		});

		lastTest = this.test[this.test.length-1];

		for(i = 0; i < this.test.length; i++){
			test = this.test[i];
			inext = i+1;
			nextTest = inext < this.test.length ? this.test[inext] : null;

			timeAdvantage = nextTest ? nextTest.result - test.result : 0;
			timeAdvantageOnLast = lastTest.result - test.result;

			if(showLog){
				console.log(("\tPosition "+(i+1)+" : "+test.name).color("purple"));
				console.log(("\t\tTotal Time : "+test.result).color("blue"));
				console.log(("\t\tTime advantage : "+timeAdvantage).color("blue"));
				console.log(("\t\tTime advantage on last : "+timeAdvantageOnLast).color("blue"));
			}
		}
	}

	this.yetRunned = false;

	return this;
};

SOLTest.prototype.compareResults = function(results) {
	var compare = resultsAreTheSame(results);

	console.log(compare);
};

var SpeedOfLight = function(params){
	return new SOLTest(params);
};

module.exports = SpeedOfLight;