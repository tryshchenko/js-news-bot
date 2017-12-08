const request = require('request');
const BaseParser = require('./base.parser');
const ffweeklyFeed = 'https://frontendfoc.us/issues';
const absoluteLinkBody = 'https://frontendfoc.us/';

class FrontendFocusParser extends BaseParser {
  getAlias() {
    return 'frontend_focus_parser';
  }

  parse() {
    request(ffweeklyFeed, (err, resp, body) => {
      this.document = this.getDOM(body);
      const issues = [].slice.call(this.document.querySelectorAll('.issue'));
      issues.forEach((issue, index) => {
        const linkHtml = issue.querySelector('a');
        const link = `${absoluteLinkBody}${linkHtml.getAttribute('href')}`;
        const title = `\u{26F3} New FrontEnd Focus rolled out: ${linkHtml.innerHTML}`;
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

module.exports = FrontendFocusParser;