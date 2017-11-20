'use strict';

const { measure } = require('./measure');

function invokeHooks(hooks) {
  return hooks.reduce((promise, cb) => (
    promise
      .then(() => (
        cb.length ? new Promise(resolve => cb(resolve)) : cb()
      ))
  ), Promise.resolve());
}

function invokeSuite(suite) {
  return invokeHooks(suite.befores)
    .then(() => invokeHooks(suite.setServiceHooks))
    .then(() => measure(suite))
    .catch(err => console.log(`Somethn' broke: ${err.message}`)) // todo
    .then(() => invokeHooks(suite.afters));
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
