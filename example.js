'use strict';

var SpeedOfLight = require('./index');

SpeedOfLight({
	name : "String assignation",
	timesToRun : 100000,
	test : {
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
	name : "Loop on Array",
	timesToRun : 100,
	test : {
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
}).run().order();