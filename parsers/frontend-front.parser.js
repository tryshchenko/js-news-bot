const request = require('request');
const BaseParser = require('./base.parser');
const frontFrontFeed = 'https://frontendfront.com/?s=javascript';

class FrontendFrontParser extends BaseParser {
  getAlias() {
    return 'frontend_front_parser';
  }

  parse() {
    request(frontFrontFeed, (err, resp, body) => {
      this.document = this.getDOM(body);
      const issues = [].slice.call(this.document.querySelectorAll('.stories ul li'));
      issues.forEach((issue, index) => {
        const titleLink = issue.querySelector('.story-title h2 a');
        const link = titleLink.getAttribute('href');
        const title = `\u{1F306} New FF: ${titleLink.getAttribute('title')}`;
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

module.exports = FrontendFrontParser;