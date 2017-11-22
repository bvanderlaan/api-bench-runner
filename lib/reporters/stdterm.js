'use strict';

const clc = require('cli-color');
const { oneLine } = require('common-tags');

module.exports = {
  suite(message) {
    process.stdout.write(`  ${clc.yellow(message)}\n`);
  },

  results(results) {
    // TODO: add support to generate the HTML report
    // apiBenchmark.getHtml(results, (error, html) => {
    //   if (err) endTest(err);
    //   fs.writeFileSync('benchmarks.html', html);
    // });

    Object.keys(results).map(key => results[key])
      .forEach((service) => {
        Object.keys(service).map(key => service[key])
          .forEach((route) => {
            const testResult = oneLine`    ${route.href}
              x ${Math.round(route.hz).toLocaleString()} ops/sec
              ±${route.stats.rme.toFixed(2)}%
              (${route.stats.sample.length} runs sampled)`;

            process.stdout.write(`    ${testResult}\n`);
          });
      });

    process.stdout.write('\n');
  },

  error(message) {
    process.stderr.write(`    ${clc.red(message)}\n\n`);
  },
};
