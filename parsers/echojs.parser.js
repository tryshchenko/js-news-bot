const request = require('request');
const BaseParser = require('./base.parser');
const echojsFeed = 'http://www.echojs.com/latest/0';

class EchoJSParser extends BaseParser {
  getAlias() {
    return 'echojs_parser';
  }

  parse() {
    request(echojsFeed, (err, resp, body) => {
      this.document = this.getDOM(body);
      const issues = [].slice.call(this.document.querySelectorAll('#newslist article'));
      issues.forEach((issue, index) => {
        const titleLink = issue.querySelector('h2 a');
        const title = titleLink.innerHTML;
        const link = titleLink.getAttribute('href');
        const message = [title, link].join('\n\n');

        this.collection.find({uid: link}).toArray((err, res) => {
          if (res.length === 0) {
            this.handleRecord(message, link);
          }
        });
      });
    });
  }
}

module.exports = EchoJSParser;