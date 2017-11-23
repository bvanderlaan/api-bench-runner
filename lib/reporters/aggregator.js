'use strict';

module.exports = class Aggregator {
  constructor(...reporters) {
    Object.defineProperty(this, 'reporters', {
      enumerable: true,
      value: reporters,
    });
  }

  suite(message) {
    this.reporters.forEach(reporter => reporter.suite(message));
  }

  results(results) {
    this.reporters.forEach(reporter => reporter.results(results));
  }

  error(suite, message) {
    this.reporters.forEach(reporter => reporter.error(suite, message));
  }

  summary() {
    this.reporters.forEach(reporter => reporter.summary());
  }
};
