const config = require('./config');
const Engine = require('./engine');

const JsweeklyParser = require('./parsers/jsweekly.parser');
const engine = new Engine(config, [JsweeklyParser]).init();