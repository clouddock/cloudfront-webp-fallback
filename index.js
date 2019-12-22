const userAgent = require('useragent')
const path = require('path')

exports.handler = async (event, context, callback) => {
	
	const request = event.Records[0].cf.request
	const headers = request.headers
	const userAgentString = headers['user-agent'] && headers['user-agent'][0] ? headers['user-agent'][0].value : null
	const agent = userAgent.lookup(userAgentString)

	// Supported browsers and minimal versions
	const supportedBrowsers = [
		{ browser: 'Chrome', version: 23 },
		{ browser: 'Opera', version: 15 },
		{ browser: 'Android', version: 53 },
		{ browser: 'Chrome Mobile', version: 55 },
		{ browser: 'Opera Mobile', version: 37 },
		{ browser: 'UC Browser', version: 11 },
		{ browser: 'Samsung Internet', version: 4 }
	]

	const supportedBrowser = supportedBrowsers.find(
		browser => browser.browser === agent.family && agent.major >= browser.version
	)

	if (supportedBrowser) {
		// Replace supported image formats with WebP
		request.uri = request.uri.replace(/(\.jpg|\.png|\.gif|\.jpeg)$/g, '.webp')
	}

	return callback(null, request)
}