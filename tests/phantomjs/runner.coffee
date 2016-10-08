page = require('webpage').create()
fs = require('fs')
system = require('system')

if system.args.length is 1
	console.error 'Usage: runner.js <config.json>'
	phantom.exit 1

config = JSON.parse fs.read(system.args[1])

unless config? and config.domain? and config.pages? and config.pages.length
	console.error 'Invalid config file'
	phantom.exit 1


stringifyStackTrace = (trace) ->
	msgStack = []
	if trace and trace.length
		msgStack.push 'TRACE:';
		trace.forEach (t) ->
			msgStack.push " -> #{(t.file || t.sourceURL)}: #{t.line} #{if t.function then "(in function #{t.function})" else ''}"

	return msgStack.join '\n'

phantom.onError = (msg, trace) ->
	Runner.logError "PHANTOM ERROR: #{msg}\n#{stringifyStackTrace trace}"

page.onError = (msg, trace) ->
	Runner.logError "PAGE ERROR: #{msg}\n#{stringifyStackTrace trace}"


class Test
	constructor: (test, @domain) ->
		{@name, @url} = test

	getUrl: ->
		"#{@domain}#{@url}"


class TestRunner
	constructor: (@tests) ->
		@currentTest = null
		@errors = []

	dequeue: ->
		if @tests.length
			@currentTest = @tests.shift()
			@runTest()
		else
			@doneCallback()

	runTest: ->
		message = "Running #{@currentTest.name}..."
		page.open @currentTest.getUrl(), (status) =>
			if status isnt "success"
				@logError status
				console.error "#{message} Failed!"
			else
				console.log "#{message} Passed."

			@dequeue()

	logError: (message) ->
		@errors.push "#{@currentTest.name}: #{message}"

	process: (@doneCallback) ->
		@dequeue()

tests = (new Test(testable, config.domain) for testable in config.pages)
runner = new TestRunner tests

runner.process ->
	if runner.errors.length
		console.error runner.errors.join('\n')
		phantom.exit 1
	else
		phantom.exit()
