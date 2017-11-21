'use strict';

const { measure } = require('./measure');

function invokeSuite(suite) {
  if (!suite) return Promise.resolve();

  return suite.invokeBefores()
    .then(() => suite.invokeServiceHooks())
    .then(() => measure(suite))
    .catch(err => console.log(`Somethn' broke: ${err.message}`)) // todo
    .then(() => suite.invokeAfters());
}

const suites = [];
let rootSuite;

module.exports = {
  addSuite(suite) {
    suites.push(suite);
  },

  addRootSuite(suite) {
    if (rootSuite) {
      throw new Error('To many roots');
    }
    rootSuite = suite;
  },

  clearRootSuite() {
    rootSuite = undefined;
  },

  run() {
    suites.push(rootSuite); // needs to be last on the list
    return suites.reduce((promise, suite) => (
      promise
        .then(() => invokeSuite(suite))
    ), Promise.resolve());
  },
};
