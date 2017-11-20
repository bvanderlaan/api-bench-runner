'use strict';

const { expect } = require('chai');

const Suite = require('../lib/suite');

describe('Suite', () => {
  describe('Title', () => {
    it('should set the suite title', () => {
      const suite = new Suite('my title');
      expect(suite.title).to.equal('my title');
    });

    it('should set the title property to be readonly', () => {
      const suite = new Suite();
      expect(() => { suite.title = 'sup'; }).to.throw(TypeError);
    });
  });

  describe('Add Service', () => {
    it('should set the service property to be readonly', () => {
      const suite = new Suite();
      expect(() => { suite.services = {}; }).to.throw(TypeError);
    });

    it('should add a service', () => {
      const suite = new Suite();
      expect(suite.services).to.deep.equals({});

      suite.addServiceHook('my service', 'http://localhost:1234');
      suite.setServiceHooks[0]();

      expect(suite.services).to.deep.equals({
        'my service': 'http://localhost:1234',
      });
    });
  });

  describe('Route', () => {
    it('should set the routes property to be readonly', () => {
      const suite = new Suite();
      expect(() => { suite.routes = {}; }).to.throw(TypeError);
    });

    it('should add a route', () => {
      const suite = new Suite();
      expect(suite.routes).to.deep.equals({});

      suite.addRoute('status', {
        method: 'get',
        route: 'status',
        expectedStatusCode: 200,
        maxMean: 0.2, // 200ms
      });
      expect(suite.routes).to.deep.equals({
        status: {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        },
      });
    });
  });

  describe('Options', () => {
    it('should set the options property to be readonly', () => {
      const suite = new Suite();
      expect(() => { suite.options = {}; }).to.throw(TypeError);
    });

    it('should set options', () => {
      const suite = new Suite();
      expect(suite.options).to.deep.equals({});

      suite.setOptions({
        debug: true,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
      });
      expect(suite.options).to.deep.equals({
        debug: true,
        delay: 0,
        maxConcurrentRequests: 100,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
        stopOnError: true,
      });
    });

    it('should over write options', () => {
      const suite = new Suite();

      suite.setOptions({
        debug: true,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
      });
      expect(suite.options).to.deep.equals({
        debug: true,
        delay: 0,
        maxConcurrentRequests: 100,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
        stopOnError: true,
      });

      suite.setOptions({
        debug: false,
        runMode: 'sequential',
        minSamples: 400,
      });
      expect(suite.options).to.deep.equals({
        debug: false,
        delay: 0,
        maxConcurrentRequests: 100,
        runMode: 'sequential',
        minSamples: 400,
        maxTime: 10,
        stopOnError: true,
      });
    });

    it('should reset to default options', () => {
      const suite = new Suite();

      suite.setOptions({
        debug: true,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
      });
      expect(suite.options).to.deep.equals({
        debug: true,
        delay: 0,
        maxConcurrentRequests: 100,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
        stopOnError: true,
      });

      suite.setOptions({});
      expect(suite.options).to.deep.equals({
        debug: false,
        delay: 0,
        maxConcurrentRequests: 100,
        runMode: 'sequence',
        minSamples: 20,
        maxTime: 10,
        stopOnError: true,
      });
    });
  });

  describe('Add After', () => {
    it('should add a after hook', () => {
      const suite = new Suite();
      expect(suite.afters).to.be.empty;

      suite.addAfter(() => {});
      expect(suite.afters).to.have.length(1);
    });

    it('should not add an undefined after hook', () => {
      const suite = new Suite();
      expect(suite.afters).to.be.empty;

      suite.addAfter();
      expect(suite.afters).to.have.length(0);
    });

    it('should not add a non function as an after hook', () => {
      const suite = new Suite();
      expect(suite.afters).to.be.empty;

      suite.addAfter(42);
      expect(suite.afters).to.have.length(0);
    });
  });

  describe('Add Before', () => {
    it('should add a before hook', () => {
      const suite = new Suite();
      expect(suite.befores).to.be.empty;

      suite.addBefore(() => {});
      expect(suite.befores).to.have.length(1);
    });

    it('should not add an undefined before hook', () => {
      const suite = new Suite();
      expect(suite.befores).to.be.empty;

      suite.addBefore();
      expect(suite.befores).to.have.length(0);
    });

    it('should not add a non function as an before hook', () => {
      const suite = new Suite();
      expect(suite.befores).to.be.empty;

      suite.addBefore(42);
      expect(suite.befores).to.have.length(0);
    });
  });
});
