'use strict';

var _ = require('underscore');
var stringColor = require("string-color");
var uniqueSOLTestID = 0;
var deepEqual = require('deepequal');

var errorCauseDiff = function(feature, diffList) {
	var i, imax = diffList.length,
	errorMsg = "The results returned by implementions of feature named \""+feature+"\" are not equal :" ;
	
	for (i=0;i<imax;i++) {
		errorMsg += "\n\tThe test named \""+diffList[i]+"\" is different from others";
	}

	console.log(errorMsg.color("red"));
};

var resultsDifferences = function(results) {
	var previousResult, i, imax = results.length, result, diffList = [];
	if (imax <= 1) {
		return diffList;
	}

	for(i=1;i<imax;i++){
		previousResult = results[i-1];
		result = results[i];

		if (!deepEqual(previousResult.result, result.result, true)) {
			diffList.push(result.testName);
		}
	}

	return diffList;
};

var Runner = function(params, showLog) {
	this.current = 0;
	this.type = params.type;
	this.max = params.max;
	this.previousTime = null;
	this.counter = 0;
};

Runner.prototype.loop = function() {
	var currentTime = Date.now(), currentIncrement;

	if (this.type === "timesToRun") {
		currentIncrement = 1;
		this.counter += this.previousTime ? currentTime - this.previousTime : 0 ;
	}
	else{
		currentIncrement = this.previousTime ? currentTime - this.previousTime : 0 ;
		this.counter++;
	}

	this.current += currentIncrement;

	this.previousTime = currentTime;

	return (this.current <= this.max);
};

var SOLTest = function(params) {
	var allTest, test, testName, params = typeof params === "object" ? params : {};

	this.yetRunned = false;
	this.testRunnedAndOk = false;

	this.name = typeof params.about === "string" ? params.about : "sol_test_"+(++uniqueSOLTestID);
	this.timesToRun = typeof params.timesToRun === "number" ? parseInt(params.timesToRun, 10) : 10000;
	this.timeScale = typeof params.timeScale === "number" ? parseInt(params.timeScale, 10) : null;

	this.testType = this.timeScale ? "timeScale" : "timesToRun";

	if (this.timeScale && typeof params.timesToRun === "number") {
		console.log("Notice : You declare both params timesToRun and timeScale. Param timesToRun will be ignored.".color("yellow"))
	}

	allTest = typeof params.implementations === "object" ? params.implementations : {};
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
	var zeroTimeError = false, runner, resultsToCompare = [], i, test, start, showLog = typeof showLog === "boolean" ? showLog : true;

	if(showLog){console.log((this.name+" - running tests "+(this.testType === "timesToRun" ? "with "+this.timesToRun+" executions per implementation" : "while approximately "+this.timeScale+" milliseconds per implementation")).color("green"));}

	for(i = 0; i < this.test.length; i++){
		test = this.test[i];

		if(showLog){console.log(("\t Test : "+test.name).color("purple"));}

		resultsToCompare.push({
			testName : test.name,
			result : test.action((
				runner = new Runner({
					type : this.testType,
					max : this.testType === "timeScale" ? this.timeScale : this.timesToRun
				})
			))
		});

		test.result = runner.counter;

		if (test.result === 0) {zeroTimeError = true;}

		if(showLog){
			console.log(("\t\t Total execution "+(this.testType === "timesToRun" ? "time" : "count")+" : "+test.result).color("blue"));
		}
	}

	this.yetRunned = true;

	this.compareResults(resultsToCompare);

	if(zeroTimeError){
		if(showLog){console.log("\tIt seems one of your implementations takes 0 milliseconds to run...\n\ttry increase timesToRun or use timeScale...\n\tor check if you use SpeedOfLight correctly. =)".color("yellow"));}
	}
	else{
		this.testRunnedAndOk = true;
	}

	return this;
};

SOLTest.prototype.order = function(showLog) {
	var advantageRatio, advantageOnLastRatio, type, typeUp, inverser, i, test, orderedResult, advantage, advantageOnLast, nextTest, inext, lastTest, showLog = typeof showLog === "boolean" ? showLog : true;
	
	if (!this.yetRunned) {
		if(showLog){console.log((this.name+" - ordering tests "+(this.testType === "timesToRun" ? "("+this.timesToRun+" executions per implementation)" : "(approximately "+this.timeScale+" milliseconds per implementation)")).color("green"));}
		this.run(false);
	}
	else{
		if(showLog){console.log((this.name+" - Ordering tests "+(this.testType === "timesToRun" ? "("+this.timesToRun+" executions per implementation)" : "(approximately "+this.timeScale+" milliseconds per implementation)")).color("green"));}
	}
	
	if (this.test.length === 0) {
		if(showLog){console.log("\tNo test defined...".color("yellow"));}
	}
	else if (this.testRunnedAndOk !== true){
		if(showLog){console.log("\tIt seems one of your implementations takes 0 milliseconds to run...\n\ttry increase timesToRun or use timeScale...\n\tor check if you use SpeedOfLight correctly. =)".color("yellow"));}
	}
	else{
		inverser = this.testType === "timesToRun" ? 1 : -1;
		this.test.sort(function(a, b) {
			if (a.result < b.result) {return -1*inverser};

			if (a.result > b.result) {return 1*inverser};

			return 0;
		});

		lastTest = this.test[this.test.length-1];

		for(i = 0; i < this.test.length; i++){
			test = this.test[i];
			inext = i+1;
			nextTest = inext < this.test.length ? this.test[inext] : null;

			advantage = nextTest ? (nextTest.result - test.result)*inverser : 0;
			advantageOnLast = (lastTest.result - test.result)*inverser;
			advantageRatio = this.testType === "timesToRun" ? 
				(nextTest ? (test.result > 0 ? (nextTest.result/test.result*100)-100 : Infinity) : 0) :
				(nextTest ? (nextTest.result > 0 ? (test.result/nextTest.result*100)-100 : Infinity) : 0);
			advantageOnLastRatio = this.testType === "timesToRun" ? 
				(test.result > 0 ? (lastTest.result/test.result*100)-100 : Infinity) :
				(lastTest.result > 0 ? (test.result/lastTest.result*100)-100 : Infinity);


			if(showLog){
				type = (this.testType === "timesToRun" ? "time" : "count");
				typeUp = type.charAt(0).toUpperCase() + type.slice(1);
				console.log(("\tPosition "+(i+1)+" : "+test.name).color("purple"));
				console.log(("\t\t"+advantageRatio+"% faster than next implementation").color("blue"));
				console.log(("\t\t"+advantageOnLastRatio+"% faster than last implementation").color("blue"));
				//console.log(("\t\tTotal execution "+type+" : "+test.result).color("blue"));
				//console.log(("\t\t"+typeUp+" advantage compared to the next implementation : "+advantage).color("blue"));
				//console.log(("\t\t"+typeUp+" advantage compared to the last implementation : "+advantageOnLast).color("blue"));
			}
		}
	}

	this.yetRunned = false;
	this.testRunnedAndOk = false;

	return this;
};

SOLTest.prototype.compareResults = function(results) {
	var compare = resultsDifferences(results);

	if (compare.length > 0) {
		errorCauseDiff(this.name, compare);
	}
};

var instantiateTest = function(params) {
	return new SOLTest(params);
};

var SpeedOfLight = function(params){
	return instantiateTest(params);
};

SpeedOfLight.benchmark = instantiateTest;
SpeedOfLight.performance = {
	test : instantiateTest
};

module.exports = SpeedOfLight;