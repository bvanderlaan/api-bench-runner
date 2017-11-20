'use strict';

const { expect, use: chaiUse } = require('chai');
const { after: mochaAfter, before: mochaBefore } = require('mocha');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chaiUse(sinonChai);

const runnerStub = sinon.stub();

const {
  options,
  route,
  service,
  suite,
  before: myBefore,
  after: myAfter,
} = proxyquire('../lib/hooks', {
  './runner': {
    addSuite: runnerStub,
  },
});

describe('Hooks', () => {
  it('should add global suite function', () => {
    expect(global.suite).to.exist.and.be.a('function');
  });

  it('should add global describe function', () => {
    expect(global.describe).to.exist.and.be.a('function');
  });

  it('should add global service function', () => {
    expect(global.service).to.exist.and.be.a('function');
  });

  it('should add global options function', () => {
    expect(global.options).to.exist.and.be.a('function');
  });

  it('should add global route function', () => {
    expect(global.route).to.exist.and.be.a('function');
  });

  it('should add global before function', () => {
    expect(global.before).to.exist.and.be.a('function');
  });

  it('should add global after function', () => {
    expect(global.after).to.exist.and.be.a('function');
  });

  describe('Suite', () => {
    it('should call the callback', () => {
      const cb = sinon.stub();
      suite('name', cb);
      expect(cb, 'callback').to.have.been.calledOnce;
    });

    describe('runner', () => {
      mochaBefore(() => runnerStub.resetHistory());
      mochaAfter(() => runnerStub.resetHistory());

      it('should call runner', () => {
        suite('name', sinon.stub());
        expect(runnerStub, 'runner').to.have.been.calledOnce;
      });
    });

    describe('before', () => {
      beforeEach(() => runnerStub.resetHistory());
      afterEach(() => runnerStub.resetHistory());

      it('should add the before callback to the suite', () => {
        const beforeCallback = sinon.stub();
        suite('name', () => {
          myBefore(beforeCallback);
        });
        expect(runnerStub, 'runner').to.have.been.calledOnce;
        const mySuite = runnerStub.firstCall.args[0];
        expect(mySuite.befores).to.have.length(1);
        expect(mySuite.befores[0]).to.equal(beforeCallback);
      });

      it('should add all the before callbacks to the suite', () => {
        const beforeCallback = sinon.stub();
        const beforeCallback2 = sinon.stub();
        const beforeCallback3 = sinon.stub();

        suite('name', () => {
          myBefore(beforeCallback);
          myBefore(beforeCallback2);
          myBefore(beforeCallback3);
        });

        expect(runnerStub, 'runner').to.have.been.calledOnce;
        const mySuite = runnerStub.firstCall.args[0];
        expect(mySuite.befores).to.have.length(3);
        expect(mySuite.befores[0], 'beforeCallBack').to.equal(beforeCallback);
        expect(mySuite.befores[1], 'beforeCallBack2').to.equal(beforeCallback2);
        expect(mySuite.befores[2], 'beforeCallBack3').to.equal(beforeCallback3);
      });
    });

    describe('after', () => {
      beforeEach(() => runnerStub.resetHistory());
      afterEach(() => runnerStub.resetHistory());

      it('should add the after callback to the suite', () => {
        const afterCallback = sinon.stub();
        suite('name', () => {
          myAfter(afterCallback);
        });

        expect(runnerStub, 'runner').to.have.been.calledOnce;
        const mySuite = runnerStub.firstCall.args[0];
        expect(mySuite.afters).to.have.length(1);
        expect(mySuite.afters[0], 'afterCallback').to.equal(afterCallback);
      });

      it('should add all the after callbacks to the suite', () => {
        const afterCallback = sinon.stub();
        const afterCallback2 = sinon.stub();
        const afterCallback3 = sinon.stub();

        suite('name', () => {
          myAfter(afterCallback);
          myAfter(afterCallback2);
          myAfter(afterCallback3);
        });

        expect(runnerStub, 'runner').to.have.been.calledOnce;
        const mySuite = runnerStub.firstCall.args[0];
        expect(mySuite.afters).to.have.length(3);
        expect(mySuite.afters[0], 'afterCallback').to.equal(afterCallback);
        expect(mySuite.afters[1], 'afterCallback2').to.equal(afterCallback2);
        expect(mySuite.afters[2], 'afterCallback3').to.equal(afterCallback3);
      });
    });

    describe('Hierarchy', () => {
      beforeEach(() => runnerStub.resetHistory());
      afterEach(() => runnerStub.resetHistory());

      it('should set child suite to parent', () => {
        suite('parent', () => {
          suite('child', sinon.stub());
        });

        const parentSuite = runnerStub.secondCall.args[0];
        const childSuite = runnerStub.firstCall.args[0];
        expect(parentSuite.title, 'parent').to.equal('parent');
        expect(childSuite.parent.title, 'child').to.equal('parent');
      });

      it('should set sibling suites to same parent', () => {
        suite('parent', () => {
          suite('child1', sinon.stub());
          suite('child2', sinon.stub());
        });

        const parentSuite = runnerStub.thirdCall.args[0];
        const child1Suite = runnerStub.firstCall.args[0];
        const child2Suite = runnerStub.secondCall.args[0];
        expect(parentSuite.title, 'parent').to.equal('parent');
        expect(child1Suite.parent.title, 'child1').to.equal('parent');
        expect(child2Suite.parent.title, 'child2').to.equal('parent');
      });
    });
  });

  describe('Service', () => {
    beforeEach(() => runnerStub.resetHistory());
    afterEach(() => runnerStub.resetHistory());

    it('should add a set service hook', () => {
      suite('name', () => {
        service('my-service', 'http://localhost:8080');
      });

      expect(runnerStub, 'runner').to.have.been.calledOnce;
      const mySuite = runnerStub.firstCall.args[0];
      expect(mySuite.setServiceHooks).to.have.length(1);
      expect(mySuite.setServiceHooks[0], 'setServiceHooks').to.be.an('function');
      mySuite.setServiceHooks[0]();
      expect(mySuite.services).to.deep.equal({
        'my-service': 'http://localhost:8080',
      });
    });
  });

  describe('Options', () => {
    beforeEach(() => runnerStub.resetHistory());
    afterEach(() => runnerStub.resetHistory());

    it('should set options', () => {
      suite('name', () => {
        options({
          runMode: 'parallel',
          minSamples: 200,
          maxTime: 20,
        });
      });
      expect(runnerStub, 'runner').to.have.been.calledOnce;
      const mySuite = runnerStub.firstCall.args[0];
      expect(mySuite.options).to.deep.equals({
        debug: false,
        delay: 0,
        maxConcurrentRequests: 100,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
        stopOnError: true,
      });
    });

    it('should set options and respect debug', () => {
      suite('name', () => {
        options({
          debug: false,
          runMode: 'parallel',
          minSamples: 200,
          maxTime: 20,
        });
      });

      expect(runnerStub, 'runner').to.have.been.calledOnce;
      const mySuite = runnerStub.firstCall.args[0];
      expect(mySuite.options).to.deep.equals({
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

  describe('Route', () => {
    beforeEach(() => runnerStub.resetHistory());
    afterEach(() => runnerStub.resetHistory());

    it('should set route', () => {
      suite('name', () => {
        route('status', {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        });
      });

      expect(runnerStub, 'runner').to.have.been.calledOnce;
      const mySuite = runnerStub.firstCall.args[0];
      expect(mySuite.routes).to.deep.equals({
        status: {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        },
      });
    });
  });
});
