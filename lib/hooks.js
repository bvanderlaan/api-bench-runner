'use strcit';

const { measure } = require('./measure');
const Suite = require('./suite');

let currentSuite;

function invokeHooks(hooks) {
  return hooks.reduce((promise, cb) => (
    promise
      .then(() => (
        cb.length ? new Promise(resolve => cb(resolve)) : cb()
      ))
  ), Promise.resolve());
}

global.suite = (description, configureSuite) => {
  currentSuite = new Suite(description, currentSuite);

  configureSuite();

  return invokeHooks(currentSuite.befores)
    .then(() => invokeHooks(currentSuite.setServiceHooks))
    .then(() => measure(currentSuite))
    .catch(err => console.log(`Somethn' broke: ${err.message}`)) // todo
    .then(() => invokeHooks(currentSuite.afters));
};

global.service = (name, baseUrl) => {
  currentSuite.addServiceHook(name, baseUrl);
};

global.options = (options) => {
  currentSuite.setOptions(options);
};

global.route = (name, options) => {
  currentSuite.addRoute(name, options);
};

global.before = (cb) => {
  currentSuite.addBefore(cb);
};

global.after = (cb) => {
  currentSuite.addAfter(cb);
};

module.exports = {
  after: global.after,
  before: global.before,
  suite: global.suite,
  service: global.service,
  options: global.options,
  route: global.route,
};
