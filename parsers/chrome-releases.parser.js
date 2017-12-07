const request = require('request');
const BaseParser = require('./base.parser');
const releasesFeed = 'https://chromereleases.googleblog.com/';

class ChromeReleasesParser extends BaseParser {
	getAlias() {
		return 'chrome_releases_parser';
	}

	getSiteUrl() {
		return 'https://chromereleases.googleblog.com/';
	}

	parse() {
		request(releasesFeed, (err, resp, body) => {
			this.document = this.getDOM(body);
			const posts = [].slice.call(this.document.querySelectorAll('.post'));
			posts.forEach((issue, index) => {
				// Not sure we need it. It gets as a link description in telegram
				// const desc = issue.querySelector('.post-content').innerHTML
				// 	.replace(/<(?:.|\n)*?>/gm, '');;
				const linkEl = issue.querySelector('.title a');
				const link = linkEl.getAttribute('href');
				const title = `New updates from chrome releases: ${linkEl.innerHTML}`;
				const message = [title, !this._isAbsoluteLink(link) ? link : `${releasesFeed}${link}`].join('\n\n');

				this.collection.find({uid: link}).toArray((err, res) => {
					if (res.length === 0) {
						this.handleRecord(message, link);
					}
				});
			});
		});
	}
}

module.exports = ChromeReleasesParser;