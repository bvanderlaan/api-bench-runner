'use strict';

const { expect, use: chaiUse } = require('chai');
const { after: mochaAfter, before: mochaBefore } = require('mocha');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chaiUse(sinonChai);

const addSuiteStub = sinon.stub();
const addRootSuiteStub = sinon.stub();

const {
  options,
  route,
  service,
  suite,
  rootSuite,
  before: myBefore,
  after: myAfter,
} = proxyquire('../lib/hooks', {
  './runner': {
    addSuite: addSuiteStub,
    addRootSuite: addRootSuiteStub,
  },
});

describe('Hooks', () => {
  it('should add global suite function', () => {
    expect(global.suite).to.exist.and.be.a('function');
  });

  it('should add global rootSuite function', () => {
    expect(global.rootSuite).to.exist.and.be.a('function');
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
      mochaBefore(() => addSuiteStub.resetHistory());
      mochaAfter(() => addSuiteStub.resetHistory());

      it('should call runner', () => {
        suite('name', sinon.stub());
        expect(addSuiteStub, 'runner').to.have.been.calledOnce;
      });
    });

    describe('before', () => {
      beforeEach(() => addSuiteStub.resetHistory());
      afterEach(() => addSuiteStub.resetHistory());

      it('should add the before callback to the suite', () => {
        const beforeCallback = sinon.stub();
        suite('name', () => {
          myBefore(beforeCallback);
        });
        expect(addSuiteStub, 'runner').to.have.been.calledOnce;
        const mySuite = addSuiteStub.firstCall.args[0];
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

        expect(addSuiteStub, 'runner').to.have.been.calledOnce;
        const mySuite = addSuiteStub.firstCall.args[0];
        expect(mySuite.befores).to.have.length(3);
        expect(mySuite.befores[0], 'beforeCallBack').to.equal(beforeCallback);
        expect(mySuite.befores[1], 'beforeCallBack2').to.equal(beforeCallback2);
        expect(mySuite.befores[2], 'beforeCallBack3').to.equal(beforeCallback3);
      });
    });

    describe('after', () => {
      beforeEach(() => addSuiteStub.resetHistory());
      afterEach(() => addSuiteStub.resetHistory());

      it('should add the after callback to the suite', () => {
        const afterCallback = sinon.stub();
        suite('name', () => {
          myAfter(afterCallback);
        });

        expect(addSuiteStub, 'runner').to.have.been.calledOnce;
        const mySuite = addSuiteStub.firstCall.args[0];
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

        expect(addSuiteStub, 'runner').to.have.been.calledOnce;
        const mySuite = addSuiteStub.firstCall.args[0];
        expect(mySuite.afters).to.have.length(3);
        expect(mySuite.afters[0], 'afterCallback').to.equal(afterCallback);
        expect(mySuite.afters[1], 'afterCallback2').to.equal(afterCallback2);
        expect(mySuite.afters[2], 'afterCallback3').to.equal(afterCallback3);
      });
    });

    describe('Hierarchy', () => {
      beforeEach(() => addSuiteStub.resetHistory());
      afterEach(() => addSuiteStub.resetHistory());

      it('should set child suite to parent', () => {
        suite('parent', () => {
          suite('child', sinon.stub());
        });

        const parentSuite = addSuiteStub.secondCall.args[0];
        const childSuite = addSuiteStub.firstCall.args[0];
        expect(parentSuite.title, 'parent').to.equal('parent');
        expect(childSuite.parent.title, 'child').to.equal('parent');
      });

      it('should set sibling suites to same parent', () => {
        suite('parent', () => {
          suite('child1', sinon.stub());
          suite('child2', sinon.stub());
        });

        const parentSuite = addSuiteStub.thirdCall.args[0];
        const child1Suite = addSuiteStub.firstCall.args[0];
        const child2Suite = addSuiteStub.secondCall.args[0];
        expect(parentSuite.title, 'parent').to.equal('parent');
        expect(child1Suite.parent.title, 'child1').to.equal('parent');
        expect(child2Suite.parent.title, 'child2').to.equal('parent');
      });
    });
  });

  describe('RootSuite', () => {
    it('should call the callback', () => {
      const cb = sinon.stub();
      rootSuite(cb);
      expect(cb, 'callback').to.have.been.calledOnce;
    });

    describe('runner', () => {
      mochaBefore(() => addRootSuiteStub.resetHistory());
      mochaAfter(() => addRootSuiteStub.resetHistory());

      it('should call runner', () => {
        rootSuite(sinon.stub());
        expect(addRootSuiteStub, 'runner').to.have.been.calledOnce;
      });
    });

    describe('before', () => {
      beforeEach(() => addRootSuiteStub.resetHistory());
      afterEach(() => addRootSuiteStub.resetHistory());

      it('should add the before callback to the suite', () => {
        const beforeCallback = sinon.stub();
        rootSuite(() => {
          myBefore(beforeCallback);
        });
        expect(addRootSuiteStub, 'runner').to.have.been.calledOnce;
        const mySuite = addRootSuiteStub.firstCall.args[0];
        expect(mySuite.befores).to.have.length(1);
        expect(mySuite.befores[0]).to.equal(beforeCallback);
      });

      it('should add all the before callbacks to the suite', () => {
        const beforeCallback = sinon.stub();
        const beforeCallback2 = sinon.stub();
        const beforeCallback3 = sinon.stub();

        rootSuite(() => {
          myBefore(beforeCallback);
          myBefore(beforeCallback2);
          myBefore(beforeCallback3);
        });

        expect(addRootSuiteStub, 'runner').to.have.been.calledOnce;
        const mySuite = addRootSuiteStub.firstCall.args[0];
        expect(mySuite.befores).to.have.length(3);
        expect(mySuite.befores[0], 'beforeCallBack').to.equal(beforeCallback);
        expect(mySuite.befores[1], 'beforeCallBack2').to.equal(beforeCallback2);
        expect(mySuite.befores[2], 'beforeCallBack3').to.equal(beforeCallback3);
      });
    });

    describe('after', () => {
      beforeEach(() => addRootSuiteStub.resetHistory());
      afterEach(() => addRootSuiteStub.resetHistory());

      it('should add the after callback to the suite', () => {
        const afterCallback = sinon.stub();
        rootSuite(() => {
          myAfter(afterCallback);
        });

        expect(addRootSuiteStub, 'runner').to.have.been.calledOnce;
        const mySuite = addRootSuiteStub.firstCall.args[0];
        expect(mySuite.afters).to.have.length(1);
        expect(mySuite.afters[0], 'afterCallback').to.equal(afterCallback);
      });

      it('should add all the after callbacks to the suite', () => {
        const afterCallback = sinon.stub();
        const afterCallback2 = sinon.stub();
        const afterCallback3 = sinon.stub();

        rootSuite(() => {
          myAfter(afterCallback);
          myAfter(afterCallback2);
          myAfter(afterCallback3);
        });

        expect(addRootSuiteStub, 'runner').to.have.been.calledOnce;
        const mySuite = addRootSuiteStub.firstCall.args[0];
        expect(mySuite.afters).to.have.length(3);
        expect(mySuite.afters[0], 'afterCallback').to.equal(afterCallback);
        expect(mySuite.afters[1], 'afterCallback2').to.equal(afterCallback2);
        expect(mySuite.afters[2], 'afterCallback3').to.equal(afterCallback3);
      });
    });

    describe('Hierarchy', () => {
      beforeEach(() => {
        addSuiteStub.resetHistory();
        addRootSuiteStub.resetHistory();
      });
      afterEach(() => {
        addSuiteStub.resetHistory();
        addRootSuiteStub.resetHistory();
      });

      it('should set child suite to parent', () => {
        rootSuite(() => {
          suite('child', sinon.stub());
        });

        const parentSuite = addRootSuiteStub.firstCall.args[0];
        const childSuite = addSuiteStub.firstCall.args[0];
        expect(childSuite.parent, 'child').to.equal(parentSuite);
      });

      it('should set sibling suites to same parent', () => {
        rootSuite(() => {
          suite('child1', sinon.stub());
          suite('child2', sinon.stub());
        });

        const parentSuite = addRootSuiteStub.firstCall.args[0];
        const child1Suite = addSuiteStub.firstCall.args[0];
        const child2Suite = addSuiteStub.secondCall.args[0];
        expect(child1Suite.parent, 'child1').to.equal(parentSuite);
        expect(child2Suite.parent, 'child2').to.equal(parentSuite);
      });
    });
  });

  describe('Service', () => {
    beforeEach(() => addSuiteStub.resetHistory());
    afterEach(() => addSuiteStub.resetHistory());

    it('should add a set service hook', () => {
      suite('name', () => {
        service('my-service', 'http://localhost:8080');
      });

      expect(addSuiteStub, 'runner').to.have.been.calledOnce;
      const mySuite = addSuiteStub.firstCall.args[0];
      expect(mySuite.setServiceHooks).to.have.length(1);
      expect(mySuite.setServiceHooks[0], 'setServiceHooks').to.be.an('function');
      mySuite.setServiceHooks[0]();
      expect(mySuite.services).to.deep.equal({
        'my-service': 'http://localhost:8080',
      });
    });
  });

  describe('Options', () => {
    beforeEach(() => addSuiteStub.resetHistory());
    afterEach(() => addSuiteStub.resetHistory());

    it('should set options', () => {
      suite('name', () => {
        options({
          runMode: 'parallel',
          minSamples: 200,
          maxTime: 20,
        });
      });
      expect(addSuiteStub, 'runner').to.have.been.calledOnce;
      const mySuite = addSuiteStub.firstCall.args[0];
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

      expect(addSuiteStub, 'runner').to.have.been.calledOnce;
      const mySuite = addSuiteStub.firstCall.args[0];
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
    beforeEach(() => addSuiteStub.resetHistory());
    afterEach(() => addSuiteStub.resetHistory());

    it('should set route', () => {
      suite('name', () => {
        route('status', {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        });
      });

      expect(addSuiteStub, 'runner').to.have.been.calledOnce;
      const mySuite = addSuiteStub.firstCall.args[0];
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
