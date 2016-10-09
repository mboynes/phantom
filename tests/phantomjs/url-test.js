var page = require('webpage').create();
var system = require('system');

// Verify and parse CLI arguments
if (1 === system.args.length) {
	console.error('Usage: url-test.js <url> ["Optional name"]');
	phantom.exit(1);
}
var testUrl = system.args[1],
	testName = testUrl;

if ( system.args[2] ) {
	testName = system.args[2];
}

/**
 * Convert a stack trace to a string for outputting.
 *
 * @param  {array} trace Stack trace.
 * @return {string}
 */
stringifyStackTrace = function(trace) {
	var msgStack;
	msgStack = [];
	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
			return msgStack.push(" -> " + (t.file || t.sourceURL) + ": " + t.line + " " + (t["function"] ? "(in function " + t["function"] + ")" : ''));
		});
	}
	return msgStack.join('\n');
};

/**
 * Output an optional error message and exit with an error code.
 *
 * @param  {...string} message Optional. Message to output before exiting.
 */
exitWithError = function() {
	console.log("\t-> Failed!");
	if (arguments.length) {
		for (var i = 0; i < arguments.length; i++) {
			console.error(arguments[i]);
		}
	}
	phantom.exit(1);
}

// Catch errors
phantom.onError = function(msg, trace) {
	exitWithError("PHANTOM ERROR: " + msg + "\n" + (stringifyStackTrace(trace)));
};
page.onError = function(msg, trace) {
	exitWithError("PAGE ERROR: " + msg + "\n" + (stringifyStackTrace(trace)));
};
page.onResourceError = function(resourceError) {
	exitWithError(
		'Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')',
		'Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString
	);
};

// Kick off the test. Load the URL and exit as passed or failed.
console.log('Testing "' + testName + '"...');
page.open(testUrl, function(status) {
	if (status === "success") {
		console.log("\t-> Passed");
		phantom.exit();
	} else {
		exitWithError();
	}
});
