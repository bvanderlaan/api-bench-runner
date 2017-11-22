'use strict';

const clc = require('cli-color');
const { oneLine } = require('common-tags');

module.exports = class StdTerm {
  constructor() {
    this.summary = [];
  }

  // eslint-disable-next-line class-methods-use-this
  suite(message) {
    process.stdout.write(`  ${clc.yellow(message)}\n`);
  }

  // eslint-disable-next-line class-methods-use-this
  results(results) {
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
  }

  error(suite, message) {
    process.stderr.write(`    ${clc.red(message)}\n\n`);
    this.summary.push({ suite, message });
  }

  summary() {
    process.stdout.write(`\n  ${clc.blueBright('Summary')}\n`);

    if (this.summary.length === 0) {
      process.stdout.write(`    ${clc.green('All Tests Pass')}\n\n`);
    } else {
      this.summary.forEach(({ suite, message }) => {
        process.stdout.write(`    ${clc.yellow(suite)}\n`);
        process.stdout.write(`      ${clc.red(message)}\n\n`);
      });
    }
    this.summary = [];
  }
};
