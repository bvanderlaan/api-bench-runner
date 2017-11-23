'use strict';

const stdterm = require('./stdterm');
const html = require('./html');
const Aggregator = require('./aggregator');

const reporters = {
  stdterm,
  html,
  default: stdterm,
};

module.exports = {
  getReporter(type, output) {
    const reporterNames = type.split(',')
      .filter(t => Object.prototype.hasOwnProperty.call(reporters, t));

    const uniqueListOfNames = [...new Set(reporterNames)];

    if (uniqueListOfNames.includes('default') && uniqueListOfNames.includes('stdterm')) {
      const i = uniqueListOfNames.indexOf('default');
      uniqueListOfNames.splice(i, 1);
    }

    if (!uniqueListOfNames.length) {
      uniqueListOfNames.push('default');
    }

    const r = uniqueListOfNames.map(name => new reporters[name](output));
    return new Aggregator(...r);
  },
};
