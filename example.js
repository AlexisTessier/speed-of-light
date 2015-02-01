'use strict';

var SpeedOfLight = require('./index');

SpeedOfLight.performance.test({
	about : "Variable declaration and first assignation",
	timeScale : 2000,
	implementations : {
		"all in first line after var keyword" : function(test) {
			var declareAndAssign = function(){
				var firstName = "Georges", lastName = "Lucas";
			};

			while(test.loop()){
				declareAndAssign();
			}
		},
		"declaration with var keyword first, then assignation" : function(test) {
			var declareAndAssign = function(){
				var firstName, lastName;
				firstName = "Georges", lastName = "Lucas";
			};

			while(test.loop()){
				declareAndAssign();
			}
		}
	}
}).order();

SpeedOfLight.benchmark({
	about : "String assignation",
	timeScale : 2000,
	implementations : {
		"Literal String" : function(test) {
			var val;

			while(test.loop()){
				val = "string content";
			}
		},

		"Reference String" : function(test) {
			var val, originVal = "string content";

			while(test.loop()){
				val = originVal;
			}
		}
	}
}).run().order();

SpeedOfLight({
	about : "Loop on Array",
	timesToRun : 20000,
	implementations : {
		"While" : function(test) {
			var i, imax, elem, array = ["hello","hello","hello","hello","hello","hello","hello","hello"];

			while(test.loop()){
				i = 0;
				imax = array.length;

				while(i < imax){
					elem = array[i];i++;
				}
			}
		},
		"Foreach" : function(test) {
			var key, elem, array = ["hello","hello","hello","hello","hello","hello","hello","hello"];

			while(test.loop()){
				for(key in array){
					elem = array[key];
				}
			}
		},

		"Classic For" : function(test) {
			var i, imax, elem, array = ["hello","hello","hello","hello","hello","hello","hello","hello"];

			while(test.loop()){
				for(i=0, imax = array.length;i<imax;i++){
					elem = array[i];
				}
			}
		}
	}
}).order();