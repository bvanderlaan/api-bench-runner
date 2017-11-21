'use strict';

const { Logger: createLogger } = require('eazy-logger');

const { name } = require('../package.json');

module.exports = createLogger({
  prefix: `{blue:[}{magenta:${name}}{blue:] }`,
  useLevelPrefixes: true,
});
