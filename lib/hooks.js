'use strcit';

const { addSuite, addRootSuite } = require('./runner');
const Suite = require('./suite');

let currentSuite;

global.rootSuite = (configureSuite) => {
  currentSuite = new Suite();
  configureSuite();
  addRootSuite(currentSuite);
};

global.suite = (description, configureSuite) => {
  currentSuite = new Suite(description, currentSuite);
  configureSuite();
  addSuite(currentSuite);
  currentSuite = currentSuite.parent;
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
  rootSuite: global.rootSuite,
  service: global.service,
  options: global.options,
  route: global.route,
};
