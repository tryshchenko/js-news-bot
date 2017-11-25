const config = require('./config');
const Engine = require('./engine');

const JsweeklyParser = require('./parsers/jsweekly.parser');
const NewsjsParser = require('./parsers/newsjs.parser');

const parsers = [
	JsweeklyParser,
	NewsjsParser
];

const engine = new Engine(config, parsers).init();