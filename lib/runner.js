'use strict';

const { measure } = require('./measure');

function invokeSuite(suite) {
  return suite.invokeBefores()
    .then(() => suite.invokeServiceHooks())
    .then(() => measure(suite))
    .catch(err => console.log(`Somethn' broke: ${err.message}`)) // todo
    .then(() => suite.invokeAfters());
}

const suites = [];

module.exports = {
  addSuite(suite) {
    suites.push(suite);
  },

  run() {
    return suites.reduce((promise, suite) => (
      promise
        .then(() => invokeSuite(suite))
    ), Promise.resolve());
  },
};
