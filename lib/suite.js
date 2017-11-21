'use strict';

const log = require('../lib/logger');

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
  Object.defineProperty(this._services, name, {
    enumerable: true,
    value: getUrl(),
  });
  log.debug(`Service config added: ${name}:${this._services[name]}`);
}

function invokeHooks(hooks, type) {
  return hooks.reduce((promise, cb) => (
    promise
      .then(() => {
        log.debug(`Invoking ${type} hook on ${this.title || 'root'}`);
        return cb.length ? new Promise(resolve => cb(resolve)) : cb();
      })
      .then(() => log.debug(`${type} hook for ${this.title || 'root'} has been invoked`))
  ), Promise.resolve())
    .then(() => hooks.splice(0, hooks.length));
}

module.exports = class Suite {
  constructor(title = '', parent) {
    Object.defineProperty(this, 'title', {
      enumerable: true,
      value: title,
    });

    Object.defineProperty(this, 'parent', {
      enumerable: true,
      value: parent,
    });

    Object.defineProperty(this, 'befores', {
      enumerable: true,
      value: [],
    });

    Object.defineProperty(this, 'afters', {
      enumerable: true,
      value: [],
    });

    Object.defineProperty(this, '_services', {
      enumerable: false,
      value: parent ? Object.assign({}, parent.services) : {},
    });

    Object.defineProperty(this, 'services', {
      enumerable: true,
      get: () => (
        parent ? Object.assign({}, parent.services, this._services) :
          Object.assign({}, this._services)
      ),
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

  invokeServiceHooks() {
    const parentHooks = this.parent ? this.parent.invokeServiceHooks() : Promise.resolve();
    return parentHooks
      .then(() => invokeHooks.call(this, this.setServiceHooks, 'set service'));
  }

  invokeBefores() {
    const parentHooks = this.parent ? this.parent.invokeBefores() : Promise.resolve();
    return parentHooks
      .then(() => invokeHooks.call(this, this.befores, 'before'));
  }

  invokeAfters() {
    return invokeHooks.call(this, this.afters, 'after');
  }
};
