'use strict';

const stdterm = require('./stdterm');
const html = require('./html');

const reporters = {
  stdterm,
  html,
  default: stdterm,
};

module.exports = {
  getReporter(type, output) {
    const Reporter = reporters[type] || reporters.default;
    return new Reporter(output);
  },
};
