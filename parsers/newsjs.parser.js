const request = require('request');
const BaseParser = require('./base.parser');
const newsjsFeed = 'https://news.js.org/?latest';

class NewsjsParser extends BaseParser {
	getAlias() {
		return 'newsjs_parser';
	}

	parse() {
		request(newsjsFeed, (err, resp, body) => {
			this.document = this.getDOM(body);
			const news = [].slice.call(this.document.querySelectorAll('.post-title a'));
			news.forEach((a, index) => {
				const title = `\u{270C} New newsjs: ${a.innerHTML}`;
				const link = a.getAttribute('href');
				const message = [title, link].join('  ');

				this.collection.find({uid: link}).toArray((err, res) => {
					if (res.length === 0) {
						this.handleRecord(message, link);
					}
				});
			});
		});
	}
}

module.exports = NewsjsParser;