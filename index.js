const config = require('./config');
const Engine = require('./engine');

const JsweeklyParser = require('./parsers/jsweekly.parser');
const NewsjsParser = require('./parsers/newsjs.parser');
const ChromeReleasesParser = require('./parsers/chrome-releases.parser');
const FrontendFocusParser = require('./parsers/frontend-focus.parser');
const NodeWeeklyParser = require('./parsers/nodeweekly.parser');
const FrontendFrontParser = require('./parsers/frontend-front.parser');
const EchoJSParser = require('./parsers/echojs.parser');
const JavascriptKicksParser = require('./parsers/javascript-kicks.parser');

const parsers = [
	JsweeklyParser,
	NewsjsParser,
	ChromeReleasesParser,
	FrontendFocusParser,
	NodeWeeklyParser,
  FrontendFrontParser,
  EchoJSParser,
  JavascriptKicksParser
];

const engine = new Engine(config, parsers).init();