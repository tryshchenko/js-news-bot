const request = require('request');
const BaseParser = require('./base.parser');
const nodeWeeklyFeed = 'https://nodeweekly.com/issues';
const absoluteLinkBody = 'https://nodeweekly.com/';

class NodeWeeklyParser extends BaseParser {
  getAlias() {
    return 'node_weekly_parser';
  }

  parse() {
    request(nodeWeeklyFeed, (err, resp, body) => {
      this.document = this.getDOM(body);
      const issues = [].slice.call(this.document.querySelectorAll('.issue'));
      issues.forEach((issue, index) => {
        const linkHtml = issue.querySelector('a');
        const link = `${absoluteLinkBody}${linkHtml.getAttribute('href')}`;
        const title = `\u{1F680} New NodeJS Weekly rolled out: ${linkHtml.innerHTML}`;
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

module.exports = NodeWeeklyParser;