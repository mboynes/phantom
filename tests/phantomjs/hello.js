var page = require('webpage').create();

phantom.onError = function(msg, trace) {
	var msgStack = ['PHANTOM ERROR: ' + msg];
	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
			msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
		});
	}
	console.error(msgStack.join('\n'));
	phantom.exit(1);
};

page.open('http://localhost:8080', function(status) {
	console.log("Status: " + status);
	if (status === "success") {
		phantom.exit();
	} else {
		phantom.exit(1);
	}
});
