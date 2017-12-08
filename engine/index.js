const Bot = require('node-telegram-bot-api');
const request = require('request');
const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient

class Engine {
	/**
	 * @param  {Object} config
	 * @param  {Array} parsers 
	 */
	constructor(config, parsers) {
		this.config = config;
		this.parsers = parsers;
		this.content = '';
		this.timeouts = {};
		this.bot = new Bot(config.token, {polling: true});
		this.sendMessageDebounced = _.debounce(this.sendMessage.bind(this), 2000);
		MongoClient.connect(config.dbPath, this.initializeDadatabase.bind(this));
	}

	replaceLinks(content) {
	    var regex = /(https?:\/\/[^\s]+)/g;
	    return content.replace(regex, function(url) {
	    	return `<a href="${url}">Open</a>`;
	    });
	}

	sendMessage() {
		const content = this.replaceLinks(this.content);
		this.messenger(this.bot, this.config.channelId)(content);
		this.content = '';
	}

	gatherParsedContent(content) {
		this.content += `${content}\n\n`;
		this.sendMessageDebounced();
	}

	/**
	 * Exported callback for mongodb initialization
	 * @param  {null | object} err
	 * @param  {object} db
	 */
	initializeDadatabase(err, db) {
		// @TODO validate errors here, it's important
		this.db = db;
		this.processParsers();
		setInterval(this.processParsers.bind(this), this.config.parseInterval);
	}

	/**
	 * Process parsers in batch mode. No need to init them manually
	 */
	processParsers() {
		console.log(`Parsing happened on ${(new Date().toString())}`);
		this.parsers.forEach(Parser => 
			new Parser(this.gatherParsedContent.bind(this), this.db).parse());
	}

	/**
	 * Messenger - curry for sending messages
	 * @param  {Bot} node-telegram-bot-api instance
	 * @param  {string} chatId channel id
	 * @return {Function} send message function
	 */
	messenger(bot, chatId) {
		return (msg) => {
			this.bot.sendMessage(chatId, msg, { parse_mode: "HTML" }); 
		}
	}

	// @TODO handle it in functional way somehow
	/**
	 * Remove user's timeout
	 * @param  {Number} user
	 */
	unblockUser(user) {
		this.timeouts[user] = undefined;
	}

	/**
	 * Manual initialization
	 */
	init() {
		this.bot.on('message', (msg) => {
			// proxy messages
			const message = msg.text.toString();
			const user = msg.from.id;

			// If user has already sent a message
			if (this.timeouts[user] !== undefined) {
				console.log('User exceeded his limit: ' + user);
				// Send to user, not to chat
				this.bot.sendMessage(user, 'Your limit is exceeded. Please wait');
				return;
			}

			this.timeouts[user] = setTimeout(this.unblockUser.bind(this), 1000 * 60 * 60, user);
			if (message !== '/start') {
				this.sendMessage(message);
			}
		});
	};
}

module.exports = Engine;