'use strict';

const { expect, use: chaiUse } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const Suite = require('../lib/suite');

chaiUse(sinonChai);

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

    it('should get services from parent suite', () => {
      const parentSuite = new Suite();
      parentSuite.addServiceHook('my service', 'http://localhost:1234');
      parentSuite.setServiceHooks[0]();
      expect(parentSuite.services).to.deep.equals({
        'my service': 'http://localhost:1234',
      });

      // Test...
      const childSuite = new Suite('child', parentSuite);
      expect(childSuite.services).to.deep.equals({
        'my service': 'http://localhost:1234',
      });
    });

    it('should concat child and parent services', () => {
      const parentSuite = new Suite();
      parentSuite.addServiceHook('my service', 'http://localhost:1234');
      parentSuite.setServiceHooks[0]();
      expect(parentSuite.services).to.deep.equals({
        'my service': 'http://localhost:1234',
      });

      // Test...
      const childSuite = new Suite('child', parentSuite);
      childSuite.addServiceHook('my other service', 'http://localhost:5678');
      childSuite.setServiceHooks[0]();

      expect(childSuite.services).to.deep.equals({
        'my service': 'http://localhost:1234',
        'my other service': 'http://localhost:5678',
      });
    });

    it('should concat child and parent services even if parent added service later', () => {
      const parentSuite = new Suite();
      parentSuite.addServiceHook('my service', 'http://localhost:1234');

      const childSuite = new Suite('child', parentSuite);
      childSuite.addServiceHook('my other service', 'http://localhost:5678');
      childSuite.setServiceHooks[0]();

      parentSuite.setServiceHooks[0]();
      expect(parentSuite.services).to.deep.equals({
        'my service': 'http://localhost:1234',
      });

      expect(childSuite.services).to.deep.equals({
        'my service': 'http://localhost:1234',
        'my other service': 'http://localhost:5678',
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

    it('should get services from parent suite', () => {
      const parentSuite = new Suite();
      parentSuite.addRoute('status', {
        method: 'get',
        route: 'status',
        expectedStatusCode: 200,
        maxMean: 0.2, // 200ms
      });
      expect(parentSuite.routes).to.deep.equals({
        status: {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        },
      });

      // Test...
      const childSuite = new Suite('child', parentSuite);
      expect(childSuite.routes).to.deep.equals({
        status: {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        },
      });
    });

    it('should concat child and parent routes', () => {
      const parentSuite = new Suite();
      parentSuite.addRoute('status', {
        method: 'get',
        route: 'status',
        expectedStatusCode: 200,
        maxMean: 0.2, // 200ms
      });
      expect(parentSuite.routes).to.deep.equals({
        status: {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        },
      });

      // Test...
      const childSuite = new Suite('child', parentSuite);
      childSuite.addRoute('version', {
        method: 'get',
        route: 'version',
        expectedStatusCode: 200,
        maxMean: 0.2, // 200ms
      });

      expect(childSuite.routes).to.deep.equals({
        status: {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        },
        version: {
          method: 'get',
          route: 'version',
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

    it('should initialize to default options', () => {
      const suite = new Suite();
      expect(suite.options).to.deep.equals({
        debug: false,
        runMode: 'sequence',
        maxConcurrentRequests: 100,
        delay: 0,
        maxTime: 10,
        minSamples: 20,
        stopOnError: true,
      });
    });

    it('should set options', () => {
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

    it('should get options from parent suite', () => {
      const parentSuite = new Suite();
      parentSuite.setOptions({
        debug: true,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
      });

      // Test...
      const childSuite = new Suite('child', parentSuite);
      expect(childSuite.options).to.deep.equals({
        debug: true,
        delay: 0,
        maxConcurrentRequests: 100,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
        stopOnError: true,
      });
    });

    it('should overwrite parent options', () => {
      const parentSuite = new Suite();
      parentSuite.setOptions({
        debug: true,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
      });

      // Test...
      const childSuite = new Suite('child', parentSuite);
      childSuite.setOptions({
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
      });
      expect(childSuite.options).to.deep.equals({
        debug: false,
        delay: 0,
        maxConcurrentRequests: 100,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
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

  describe('Invoke Service Hook', () => {
    it('should call service hook', () => {
      const serviceCallback = sinon.stub();
      const suite = new Suite();
      suite.addServiceHook('name', serviceCallback);
      expect(suite.setServiceHooks).to.have.length(1);

      return suite.invokeServiceHooks()
        .then(() => {
          expect(serviceCallback).to.have.been.calledOnce;
        });
    });

    it('should call parents service hook', () => {
      const serviceCallback = sinon.stub();
      const parentSuite = new Suite('parent');
      parentSuite.addServiceHook('name', serviceCallback);
      expect(parentSuite.setServiceHooks).to.have.length(1);

      const childSuite = new Suite('child', parentSuite);
      expect(childSuite.setServiceHooks).to.be.empty;

      return childSuite.invokeServiceHooks()
        .then(() => {
          expect(serviceCallback).to.have.been.calledOnce;
        });
    });

    it('should call both parent and child\'s service hooks', () => {
      const serviceCallback = sinon.stub();
      const parentSuite = new Suite('parent');
      parentSuite.addServiceHook('name', serviceCallback);
      expect(parentSuite.setServiceHooks).to.have.length(1);

      const serviceCallback2 = sinon.stub();
      const childSuite = new Suite('child', parentSuite);
      childSuite.addServiceHook('name', serviceCallback2);
      expect(childSuite.setServiceHooks).to.have.length(1);

      return childSuite.invokeServiceHooks()
        .then(() => {
          expect(serviceCallback, 'parent hook').to.have.been.calledOnce;
          expect(serviceCallback2, 'child hook').to.have.been.calledOnce;
        });
    });

    it('should not call service hook twice', () => {
      const serviceCallback = sinon.stub();
      const suite = new Suite('me');
      suite.addServiceHook('name', serviceCallback);
      expect(suite.setServiceHooks).to.have.length(1);

      return suite.invokeServiceHooks()
        .then(() => suite.invokeServiceHooks())
        .then(() => {
          expect(serviceCallback).to.have.been.calledOnce;
        });
    });
  });

  describe('Invoke Befores', () => {
    it('should call before hook', () => {
      const beforeCallback = sinon.stub();
      const suite = new Suite();
      suite.addBefore(beforeCallback);
      expect(suite.befores).to.have.length(1);

      return suite.invokeBefores()
        .then(() => {
          expect(beforeCallback).to.have.been.calledOnce;
        });
    });

    it('should call parents before hook', () => {
      const beforeCallback = sinon.stub();
      const parentSuite = new Suite('parent');
      parentSuite.addBefore(beforeCallback);
      expect(parentSuite.befores).to.have.length(1);

      const childSuite = new Suite('child', parentSuite);
      expect(childSuite.befores).to.be.empty;

      return childSuite.invokeBefores()
        .then(() => {
          expect(beforeCallback).to.have.been.calledOnce;
        });
    });

    it('should call both parent and child\'s before hooks', () => {
      const beforeCallback = sinon.stub();
      const parentSuite = new Suite('parent');
      parentSuite.addBefore(beforeCallback);
      expect(parentSuite.befores).to.have.length(1);

      const beforeCallback2 = sinon.stub();
      const childSuite = new Suite('child', parentSuite);
      childSuite.addBefore(beforeCallback2);
      expect(childSuite.befores).to.have.length(1);

      return childSuite.invokeBefores()
        .then(() => {
          expect(beforeCallback, 'parent hook').to.have.been.calledOnce;
          expect(beforeCallback2, 'child hook').to.have.been.calledOnce;
        });
    });

    it('should not call before hook twice', () => {
      const beforeCallback = sinon.stub();
      const suite = new Suite();
      suite.addBefore(beforeCallback);
      expect(suite.befores).to.have.length(1);

      return suite.invokeBefores()
        .then(() => suite.invokeBefores())
        .then(() => {
          expect(beforeCallback).to.have.been.calledOnce;
        });
    });
  });

  describe('Invoke Afters', () => {
    it('should call after hook', () => {
      const afterCallback = sinon.stub();
      const suite = new Suite();
      suite.addAfter(afterCallback);
      expect(suite.afters).to.have.length(1);

      return suite.invokeAfters()
        .then(() => {
          expect(afterCallback).to.have.been.calledOnce;
        });
    });

    it('should not call parents after hook', () => {
      const afterCallback = sinon.stub();
      const parentSuite = new Suite('parent');
      parentSuite.addAfter(afterCallback);
      expect(parentSuite.afters).to.have.length(1);

      const childSuite = new Suite('child', parentSuite);
      expect(childSuite.afters).to.be.empty;

      return childSuite.invokeAfters()
        .then(() => {
          expect(afterCallback).to.have.not.been.called;
        });
    });

    it('should call only the child\'s after hooks', () => {
      const afterCallback = sinon.stub();
      const parentSuite = new Suite('parent');
      parentSuite.addAfter(afterCallback);
      expect(parentSuite.afters).to.have.length(1);

      const afterCallback2 = sinon.stub();
      const childSuite = new Suite('child', parentSuite);
      childSuite.addAfter(afterCallback2);
      expect(childSuite.afters).to.have.length(1);

      return childSuite.invokeAfters()
        .then(() => {
          expect(afterCallback, 'parent hook').to.have.not.been.called;
          expect(afterCallback2, 'child hook').to.have.been.calledOnce;
        });
    });

    it('should not call after hook twice', () => {
      const afterCallback = sinon.stub();
      const suite = new Suite();
      suite.addAfter(afterCallback);
      expect(suite.afters).to.have.length(1);

      return suite.invokeAfters()
        .then(() => suite.invokeAfters())
        .then(() => {
          expect(afterCallback).to.have.been.calledOnce;
        });
    });
  });
});
