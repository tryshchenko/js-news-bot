const request = require('request');
const BaseParser = require('./base.parser');
const jsKicksFeed = 'https://javascriptkicks.com/stories';

class JavascriptKicksParser extends BaseParser {
  getAlias() {
    return 'javascript_kicks_parser';
  }

  parse() {
    request(jsKicksFeed, (err, resp, body) => {
      this.document = this.getDOM(body);
      const issues = [].slice.call(this.document.querySelectorAll('.media-body'));
      issues.forEach((issue, index) => {
        const titleLink = issue.querySelector('a');
        const title = `\u{1F33D} New FF: ${titleLink.getAttribute('title')}`;
        const link = titleLink.getAttribute('href');
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

module.exports = JavascriptKicksParser;