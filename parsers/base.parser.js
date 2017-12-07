const jsdom = require("jsdom");

class BaseParser {
	/**
	 * Get alias. We use it as a collection name in DB.
	 * By design - one parser one collection. Parsers 
	 * should not know about other collections
	 * @return {string}
	 */
	getAlias() {
		return 'default_parser';
	}

	/**
	 * Checks if parsed link is absolute
	 * @param  {String} link parsed link
	 * @return  {Boolean} is link absolute
	 */
	_isAbsoluteLink(link) {
		return /^(http|https)/.test(link);
	}

	/**
	 * @param  {Function} curry around bot api
	 * @param  {Object} db
	 */
	constructor(sendMessage, db = {}) {
		this.sendMessage = sendMessage;
		this.collection = db.collection(this.getAlias());
	}

	/**
	 * Wrapper for jsdom initialization
	 * @param  {string} Whole html as a string
	 * @return {Object} DOM element
	 */
	getDOM(body) {
		// console.log(body);
		return (new jsdom.JSDOM(body)).window.document;
	}

	/**
	 * [OPTIONAL] - handle uniqueness in automatic way and send a message
	 * You can use handRecord or send message if you don't need a db
	 * @param  {string} message
	 * @param  {string} key
	 */
	handleRecord(message, key) {
		const record = {
			uid: key,
			created: new Date().getTime()
		};
		this.sendMessage(message);
		this.collection.insert(record, (err, res) => {});
	}
}

module.exports = BaseParser;