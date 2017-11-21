'use strict';

const { measure } = require('./measure');
const log = require('../lib/logger');

function invokeSuite(suite, reporter) {
  if (!suite) return Promise.resolve();

  log.debug(`Executing suite ${suite.title || 'root'}`);
  return suite.invokeBefores()
    .then(() => suite.invokeServiceHooks())
    .then(() => measure(suite, reporter))
    .catch(err => reporter.error(`Somethn' broke: ${err.message}`))
    .then(() => suite.invokeAfters())
    .then(() => log.debug(`Finished executing suite ${suite.title || 'root'}`));
}

const suites = [];
let rootSuite;

module.exports = {
  addSuite(suite) {
    log.debug(`Adding suite ${suite.title} to runner`);
    suites.push(suite);
  },

  addRootSuite(suite) {
    if (rootSuite) {
      throw new Error('To many roots');
    }
    log.debug('Adding setup/root suite to runner');
    rootSuite = suite;
  },

  clearRootSuite() {
    rootSuite = undefined;
  },

  run(reporter) {
    suites.push(rootSuite); // needs to be last on the list
    return suites.reduce((promise, suite) => (
      promise
        .then(() => invokeSuite(suite, reporter))
    ), Promise.resolve());
  },
};
