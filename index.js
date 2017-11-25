const config = require('./config');
const Engine = require('./engine');

const JsweeklyParser = require('./parsers/jsweekly.parser');
const NewsjsParser = require('./parsers/newsjs.parser');
const ChromeReleasesParser = require('./parsers/chrome-releases.parser');

const parsers = [
	JsweeklyParser,
	NewsjsParser,
	ChromeReleasesParser
];

const engine = new Engine(config, parsers).init();