'use script';

const Promise = require('bluebird');
const apiBenchmark = Promise.promisifyAll(require('api-benchmark'));
const clc = require('cli-color');

function endTest(err) {
  if (err) {
    process.stdout.write(clc.red(`  Done with errors: ${err}\n`));
    return Promise.reject(err);
  }
  process.stdout.write('  Done\n');
  return Promise.resolve(err);
}

function isEmpty(object) {
  return Object.keys(object).length === 0;
}

module.exports = {
  measure(suite) {
    const { services, routes, options } = suite;
    if (isEmpty(services) || isEmpty(routes) || isEmpty(options)) {
      return Promise.resolve();
    }

    const title = (suite.parent && suite.parent.title) ? `${suite.parent.title} ${suite.title}` : `${suite.title}`;
    process.stdout.write(`  ${title}\n`);

    return apiBenchmark.measureAsync(services, routes, options)
      .then((/* results */) => {
        // TODO: some how print out the results
        // TODO: add support to generate the HTML report
      // apiBenchmark.getHtml(results, (error, html) => {
      //   if (err) endTest(err);

      //   fs.writeFileSync('benchmarks.html', html);
        endTest();
      // });
      })
      .catch(endTest);
  },
};
