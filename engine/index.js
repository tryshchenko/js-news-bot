const Bot = require('node-telegram-bot-api');
const request = require('request');
const MongoClient = require('mongodb').MongoClient

const db = {};
const timeouts = {};

class Engine {
	/**
	 * @param  {Object} config
	 * @param  {Array} parsers 
	 */
	constructor(config, parsers) {
		this.config = config;
		this.parsers = parsers;
		this.bot = new Bot(config.token, {polling: true});
		this.sendMessage = this.messenger(this.bot, config.channelId);
		MongoClient.connect(config.dbPath, this.initializeDadatabase.bind(this));
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
			new Parser(this.sendMessage, this.db).parse());
	}

	/**
	 * Messenger - curry for sending messages
	 * @param  {Bot} node-telegram-bot-api instance
	 * @param  {string} chatId channel id
	 * @return {Function} send message function
	 */
	messenger(bot, chatId) {
		return (msg) => {
			this.bot.sendMessage(chatId, msg); 
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

			this.timeouts[user] = setTimeout(this.unblockUser, 1000 * 60, user);
			if (message !== 'start') {
				this.sendMessage(message);
			}
		});
	}
}

module.exports = Engine;