'use script';

const Promise = require('bluebird');
const apiBenchmark = Promise.promisifyAll(require('api-benchmark'));

const log = require('../lib/logger');

function isEmpty(object) {
  return Object.keys(object).length === 0;
}

module.exports = {
  measure(suite, report) {
    const { services, routes, options } = suite;
    if (isEmpty(services) || isEmpty(routes) || isEmpty(options)) {
      return Promise.resolve();
    }

    const title = (suite.parent && suite.parent.title) ? `${suite.parent.title} ${suite.title}` : `${suite.title}`;
    log.debug(`Starting tests for ${title || 'root'}`);

    report.suite(`${title}`);

    return apiBenchmark.measureAsync(services, routes, options)
      .then(results => report.results(results))
      .catch(err => report.error(err));
  },
};
