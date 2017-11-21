'use strict';

const clc = require('cli-color');

module.exports = {
  log(message) {
    process.stdout.write(`  ${message}\n`);
  },

  error(message) {
    process.stderr.write(`  ${clc.red(message)}\n`);
  },
};
