var page = require('webpage').create();
var hasErrors = false;

page.onError = function(msg, trace) {
	var msgStack = ['PAGE JS ERROR: ' + msg];

	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
			msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
		});
	}

	console.error(msgStack.join('\n'));
	hasErrors = true;
};

phantom.onError = function(msg, trace) {
	var msgStack = ['PHANTOM ERROR: ' + msg];
	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
			msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
		});
	}
	console.error(msgStack.join('\n'));
	hasErrors = true;
};

page.onResourceError = function(resourceError) {
	console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
	console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
	hasErrors = true;
};

page.open('http://127.0.0.1:8080', function(status) {
	console.log("Status: " + status);
	if (status === "success" && !hasErrors) {
		phantom.exit();
	} else {
		phantom.exit(1);
	}
});
