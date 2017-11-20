'use strict';

const defaultOptions = {
  debug: false,
  runMode: 'sequence',
  maxConcurrentRequests: 100,
  delay: 0,
  maxTime: 10,
  minSamples: 20,
  stopOnError: true,
};

function setService(name, getUrl) {
  Object.defineProperty(this.services, name, {
    enumerable: true,
    value: getUrl(),
  });
}

module.exports = class Suite {
  constructor(title, parent) {
    Object.defineProperty(this, 'title', {
      enumerable: true,
      value: title,
    });

    Object.defineProperty(this, 'befores', {
      enumerable: true,
      value: [],
    });

    Object.defineProperty(this, 'afters', {
      enumerable: true,
      value: [],
    });

    Object.defineProperty(this, 'services', {
      enumerable: true,
      value: parent ? Object.assign({}, parent.services) : {},
    });

    Object.defineProperty(this, 'setServiceHooks', {
      enumerable: true,
      value: [],
    });

    Object.defineProperty(this, 'routes', {
      enumerable: true,
      value: parent ? Object.assign({}, parent.routes) : {},
    });

    Object.defineProperty(this, 'options', {
      enumerable: true,
      value: parent ? Object.assign({}, parent.options) : Object.assign({}, defaultOptions),
    });
  }

  addAfter(after) {
    if (after && (typeof after === 'function')) {
      this.afters.push(after);
    }
  }

  addBefore(before) {
    if (before && (typeof before === 'function')) {
      this.befores.push(before);
    }
  }

  addRoute(name, options) {
    Object.defineProperty(this.routes, name, {
      enumerable: true,
      value: options,
    });
  }

  addServiceHook(name, url) {
    const getUrl = (typeof url !== 'function') ? () => url : url;
    this.setServiceHooks.push(setService.bind(this, name, getUrl));
  }

  setOptions(options) {
    Object.assign(this.options, defaultOptions, options);
  }
};
