'use strict';

const stdterm = require('./stdterm');

const reporters = {
  stdterm,
  default: stdterm,
};

module.exports = {
  getReporter(type) {
    const r = reporters[type] || reporters.default;
    return Object.create(r.prototype);
  },
};
