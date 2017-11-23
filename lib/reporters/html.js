'use strict';

const apiBenchmark = require('api-benchmark');
const Promise = require('bluebird');
const clc = require('cli-color');
const fs = Promise.promisifyAll(require('fs'));

module.exports = class HTML {
  constructor(filename = 'benchmarks.html') {
    Object.defineProperty(this, 'output', {
      enumerable: true,
      value: filename,
    });

    Object.defineProperty(this, 'masterResults', {
      enumerable: true,
      value: {},
    });

    Object.defineProperty(this, 'currentSuite', {
      enumerable: true,
      writable: true,
      value: '',
    });
  }

  suite(message) {
    this.currentSuite = message;
  }

  results(results) {
    Object.keys(results).forEach((serviceKey) => {
      const service = results[serviceKey];
      const newService = {};

      Object.keys(service).forEach((routeKey) => {
        const route = Object.assign({}, service[routeKey]);
        route.name = `${this.currentSuite} - ${route.name}`;

        newService[`${this.currentSuite} - ${routeKey}`] = route;
      });

      this.masterResults[serviceKey] = this.masterResults[serviceKey] || {};
      Object.assign(this.masterResults[serviceKey], newService);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  error(suite, message) {
    const msg = `${suite} - ${message}`;
    process.stderr.write(`  ${clc.red(msg)}\n`);
  }

  summary() {
    return apiBenchmark.getHtmlAsync(this.masterResults)
      .then(html => fs.writeFileAsync(this.output, html))
      .catch(err => process.stderr.write(`  ${clc.red(`Failed to generate HTML: ${err.message}`)}\n`));
  }
};
