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

module.exports = {
  measure(suite) {
    process.stdout.write(`  ${suite.title}\n`);
    const { services, routes, options } = suite;
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
