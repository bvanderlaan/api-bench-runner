'use strict';

const { expect, use: chaiUse } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const Suite = require('../lib/suite');

const measureStub = sinon.stub();
const runner = proxyquire('../lib/runner', {
  './measure': {
    measure: measureStub,
  },
});

chaiUse(sinonChai);

describe('Runner', () => {
  describe('before', () => {
    it('should call the before callback', () => {
      const beforeCallback = sinon.stub();
      const suite = new Suite();
      suite.addBefore(beforeCallback);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(beforeCallback, 'beforeCallBack').to.have.been.calledOnce;
        });
    });

    it('should call all the before callbacks', () => {
      const beforeCallback = sinon.stub();
      const beforeCallback2 = sinon.stub();
      const beforeCallback3 = sinon.stub();

      const suite = new Suite();
      suite.addBefore(beforeCallback);
      suite.addBefore(beforeCallback2);
      suite.addBefore(beforeCallback3);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(beforeCallback, 'beforeCallBack').to.have.been.calledOnce;
          expect(beforeCallback2, 'beforeCallBack2').to.have.been.calledOnce;
          expect(beforeCallback3, 'beforeCallBack3').to.have.been.calledOnce;
        });
    });

    it('should call the before callback asynchronously', () => {
      function cb(done) {
        done();
      }
      const beforeCallback = sinon.spy(cb);
      const suite = new Suite();
      suite.addBefore(beforeCallback);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(beforeCallback, 'beforeCallBack').to.have.been.calledOnce;
        });
    });

    it('should call the before callback asynchronously via promise', () => {
      const beforeCallback = sinon.stub().resolves(42);
      const suite = new Suite();
      suite.addBefore(beforeCallback);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(beforeCallback, 'beforeCallBack').to.have.been.calledOnce;
        });
    });
  });

  describe('after', () => {
    it('should call the after callback', () => {
      const afterCallback = sinon.stub();
      const suite = new Suite();
      suite.addAfter(afterCallback);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(afterCallback, 'afterCallback').to.have.been.calledOnce;
        });
    });

    it('should call all the after callbacks', () => {
      const afterCallback = sinon.stub();
      const afterCallback2 = sinon.stub();
      const afterCallback3 = sinon.stub();

      const suite = new Suite();
      suite.addAfter(afterCallback);
      suite.addAfter(afterCallback2);
      suite.addAfter(afterCallback3);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(afterCallback, 'afterCallback').to.have.been.calledOnce;
          expect(afterCallback2, 'afterCallback2').to.have.been.calledOnce;
          expect(afterCallback3, 'afterCallback3').to.have.been.calledOnce;
        });
    });

    it('should call the after callback asynchronously', () => {
      function cb(done) {
        done();
      }
      const afterCallback = sinon.spy(cb);
      const suite = new Suite();
      suite.addAfter(afterCallback);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(afterCallback, 'afterCallback').to.have.been.calledOnce;
        });
    });

    it('should call the after callback asynchronously via promise', () => {
      const afterCallback = sinon.stub().resolves(42);
      const suite = new Suite();
      suite.addAfter(afterCallback);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(afterCallback, 'afterCallback').to.have.been.calledOnce;
        });
    });
  });

  describe('Service', () => {
    it('should set service', () => {
      const suite = new Suite();
      suite.addServiceHook('my-service', 'http://localhost:8080');

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(suite.services).to.deep.equals({
            'my-service': 'http://localhost:8080',
          });
        });
    });

    it('should set service after the before hook', () => {
      let url;
      const suite = new Suite();
      suite.addBefore(() => { url = 'http://localhost:8080'; });
      suite.addServiceHook('my-service', () => url);

      runner.addSuite(suite);
      return runner.run()
        .then(() => {
          expect(suite.services).to.deep.equals({
            'my-service': 'http://localhost:8080',
          });
        });
    });
  });
});
