'use script';

const Promise = require('bluebird');
const apiBenchmark = Promise.promisifyAll(require('api-benchmark'));

const log = require('../lib/logger');

function isEmpty(object) {
  return Object.keys(object).length === 0;
}

module.exports = {
  measure(suite, reporter) {
    const { services, routes, options } = suite;
    if (isEmpty(services) || isEmpty(routes) || isEmpty(options)) {
      return Promise.resolve();
    }

    const title = (suite.parent && suite.parent.title) ? `${suite.parent.title} ${suite.title}` : `${suite.title}`;
    log.debug(`Starting tests for ${title || 'root'}`);

    reporter.log(`${title}`);

    return apiBenchmark.measureAsync(services, routes, options)
      .then((/* results */) => {
        // TODO: some how print out the results
        // TODO: add support to generate the HTML report
      // apiBenchmark.getHtml(results, (error, html) => {
      //   if (err) endTest(err);

      //   fs.writeFileSync('benchmarks.html', html);
        reporter.log('Done');
      // });
      })
      .catch((err) => {
        reporter.error(`Done with errors: ${err}`);
        throw err;
      });
  },
};
